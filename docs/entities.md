# Entities

> This file is the contract between the frontend and the backend (next workshop).
> For each entity: fields with types, relations, and who is allowed to do what.
> The entity type lives in `frontend/src/features/<name>/types.ts` and the mock API in
> `frontend/src/features/<name>/api/<name>-api.ts`.

## Category

Code: `frontend/src/features/categories/` (`types.ts`, `api/categories-api.ts`, `api/use-categories.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| name | string, 2–40 characters | yes | e.g. "Roads and potholes" |
| slug | string, kebab-case | yes | unique, used in URL filters |

**Relations:** a category has many reports.

**Access rules:** everyone can see categories; only an administrator can create, edit or delete one. A category that has reports cannot be deleted.

**API the frontend expects:** `GET /categories`, `GET /categories/:id`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id`.

## User

Code: `frontend/src/features/users/` (`types.ts`, `api/users-api.ts`, `api/use-users.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| name | string, 2–60 characters | yes | |
| email | email | yes | unique, compared without regard to case |
| role | `citizen` \| `administrator` | yes | a visitor is not a user, it is someone who is not signed in; an account created by signing up is always `citizen` |
| avatarUrl | URL | no | |
| createdAt | date | yes | assigned by the backend |

**Relations:** a user has many reports (as author) and many stars.

**Access rules:** an administrator can see all users and change roles. A citizen can see and edit only their own profile; other users' `id`, `name` and `avatarUrl` are public (they appear on reports), `email` is not. The password is never part of a `User` and no API returns it.

**API the frontend expects:** `GET /users?search=&role=`, `GET /users/:id`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`. Signing up and signing in are in the "Session (auth)" section below. In the mock, every account lives in one shared table (`userTable` in `lib/mock-db.ts`) that `users`, `auth` and `reports` all read.

## Report

Code: `frontend/src/features/reports/` (`types.ts`, `api/reports-api.ts`, `api/use-reports.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| title | string, 3–80 characters | yes | |
| description | string, 10–1000 characters | yes | |
| photoUrl | URL | yes | shown at 4:3; the address returned by `POST /uploads` (see below) |
| address | string, 3–120 characters | yes | shown in lists |
| latitude, longitude | number | yes | for the small map on the detail page |
| category | `{ id, name }` | yes | embedded summary of the category; the request sends `categoryId` |
| author | `{ id, name }` | yes | embedded summary of the user; set by the backend from the session (the mock request sends `authorId`) |
| status | `pending` \| `approved` \| `in_progress` \| `resolved` \| `rejected` | yes | starts as `pending`, only an administrator changes it |
| rejectionReason | string | no | set by the administrator when status is `rejected` |
| starCount | number ≥ 0 | yes | number of stars, computed by the backend, never sent by the client |
| createdAt | date-time (ISO 8601) | yes | set automatically |

**Lifecycle:** `pending` → `approved` → `in_progress` → `resolved`, or `pending` → `rejected`.

**Relations:** a report belongs to one user (author) and one category, and has many stars.

**Access rules:**
- Everyone, including visitors, can see `approved`, `in_progress` and `resolved` reports.
- A signed-in citizen can create a report (it always starts as `pending`) and sees their own reports in every status.
- Only an administrator sees `pending` and `rejected` reports of others and changes `status`.
- The author can edit or delete a report only while it is `pending`; an administrator always can.
- An edit changes content only (`title`, `description`, `photoUrl`, `address`, `latitude`, `longitude`, `categoryId`). `status` and `rejectionReason` are changed only by an administrator, and the author of a report can never be changed.

**API the frontend expects:** `GET /reports?search=&status=&categoryId=&authorId=&sort=newest|stars`, `GET /reports/:id`, `POST /reports`, `PATCH /reports/:id`, `DELETE /reports/:id`.
- `status` accepts one value or a comma-separated list (`status=approved,in_progress`).
- Without `status`, only `approved`, `in_progress` and `resolved` are returned, unless `authorId` is given (a citizen's own reports, every status).
- `sort=stars` orders by `starCount` descending, ties newest first. **The ranking** is `GET /reports?status=approved,in_progress&sort=stars`; resolved and rejected reports are not in it.

**Photo upload:** the report form sends the photo first, then the report.
- `POST /uploads` takes one image file (`multipart/form-data`, field `file`; images only, up to 5 MB) and returns `{ "url": "<URL>" }`. Only a signed-in user can upload. `POST /reports` and `PATCH /reports/:id` then send that URL as `photoUrl`.
- The mock (`reportsApi.uploadPhoto`) returns a temporary browser address instead, which stops working when the page is reloaded.

## Star

Code: `frontend/src/features/stars/` (`types.ts`, `api/stars-api.ts`, `api/use-stars.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| reportId | number | yes | the starred report |
| userId | number | yes | the citizen who starred it; set by the backend from the session (the mock request sends it) |
| createdAt | date-time (ISO 8601) | yes | set automatically |

**Relations:** a star links one user and one report. `Report.starCount` is the number of its stars.

**Access rules:**
- A signed-in citizen can star a report once; the pair `(reportId, userId)` is unique (a second star is a conflict error).
- A citizen cannot star their own report.
- Only `approved` and `in_progress` reports can be starred.
- A citizen can remove only their own star. Visitors cannot star.
- Stars cannot be edited, so there is no `PATCH`.

**API the frontend expects:** `GET /stars?reportId=&userId=`, `GET /stars/:id`, `POST /stars`, `DELETE /stars/:id`. The signed-in citizen's stars (`?userId=`) tell the UI which reports to show as starred, and give the `id` needed to remove a star.

## Session (auth)

Code: `frontend/src/features/auth/` (`types.ts`, `api/auth-api.ts`, `api/use-auth.ts`). The session is not a stored entity, so it has no list/get/create/update/remove.

`CurrentUser`: the signed-in user as the frontend needs it.

| Field | Type | Notes |
| --- | --- | --- |
| id | number | the `User` id |
| name | string | |
| role | `citizen` \| `administrator` | decides what the UI offers |

`NewAccount`: what a visitor sends to sign up.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| name | string, 2–60 characters | yes | |
| email | email | yes | must not belong to another account (a conflict error otherwise) |
| password | string, 8–100 characters | yes | stored hashed by the backend, never returned |

The role is never sent: a new account is always a `citizen`.

**Access rules:** anyone can ask who is signed in (the answer is `null` for a visitor), sign in and sign up; only a signed-in user can sign out. A user who is already signed in is sent away from the sign-in and sign-up pages. The backend, not the frontend, takes the author of a report and the user of a star from the session.

**API the frontend expects:**
- `GET /auth/me`: `CurrentUser` or `null`.
- `POST /auth/sign-in`: `{ email, password }` returns `CurrentUser`; wrong credentials are an error that does not say which of the two was wrong.
- `POST /auth/sign-up`: `NewAccount` returns `CurrentUser` and signs the new user in; an email that is already taken is a conflict error.
- `POST /auth/sign-out`.

The pages accept a `from` query parameter (e.g. `/sign-in?from=/reports/3`) and return there after signing in. Only a path inside the app is followed.

**Mock:** the session is only the user id in `localStorage`, and accounts live in memory, so an account created by signing up disappears when the page is reloaded (the session then ends). Seeded accounts accept any non-empty password; accounts created by signing up need the password they chose.
