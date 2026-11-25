---
title: Routes without a command
description: The console routes the command line leaves out, by reason: routes for devices and clients, pages of the console, signing in and old addresses.
order: 100
quoted: true
---

Every route of the console has a command, or is here with the reason. `neodesk api` still sends any request.

A page or file of the web console: open it in a browser.

- `GET /_ui/immutable/{rest...}`
- `GET /app`
- `GET /app/{rest...}`
- `GET /branding/favicon.svg`
- `GET /console-boot.js`
- `GET /css/branding.css`
- `GET /css/theme.css`
- `GET /generator`
- `GET /remote-cdap/{deviceId}`
- `GET /remote-dashboard`
- `GET /remote-desktop/{deviceId}`
- `GET /tenants`
- `GET /{rest...}`

An upload for the web console's editor (pictures, fonts, chat files); use the console.

- `POST /api/chat/upload`
- `POST /api/settings/branding/upload-background`
- `POST /api/settings/branding/upload-logo`
- `POST /api/settings/fonts/upload`

Called by NeoDesk agents and clients with a device token, not by people.

- `DELETE /api/nd/help-requests/{id}`
- `DELETE /api/nd/rules/{id}`
- `DELETE /api/nd/session/{id}`
- `GET /api/dataguard/dlp-policies`
- `GET /api/files/file-transfer/{id}`
- `GET /api/inventory/inventory/{id}`
- `GET /api/nd`
- `GET /api/nd/alerts`
- `GET /api/nd/appearance`
- `GET /api/nd/branding`
- `GET /api/nd/chat/history`
- `GET /api/nd/commands`
- `GET /api/nd/commands/{id}`
- `GET /api/nd/device-policy`
- `GET /api/nd/dlp-policies`
- `GET /api/nd/file-transfer/{id}`
- `GET /api/nd/help-requests`
- `GET /api/nd/inventory/{id}`
- `GET /api/nd/notifications`
- `GET /api/nd/operator-info`
- `GET /api/nd/operator/devices`
- `GET /api/nd/operator/sessions`
- `GET /api/nd/peer/{id}`
- `GET /api/nd/peers`
- `GET /api/nd/register-status`
- `GET /api/nd/resource-policy`
- `GET /api/nd/rules`
- `GET /api/nd/rules/{id}`
- `GET /api/nd/server-info`
- `GET /api/nd/session/{id}`
- `GET /api/nd/smtp`
- `GET /api/nd/{id}`
- `GET /api/nd/{id}/top`
- `GET /api/tickets/nd`
- `PATCH /api/nd/rules/{id}`
- `POST /api/activity/activity`
- `POST /api/automation/commands/{id}/result`
- `POST /api/dataguard/dlp-events`
- `POST /api/files/file-transfer`
- `POST /api/inventory/inventory`
- `POST /api/inventory/telemetry`
- `POST /api/nd/activity`
- `POST /api/nd/alerts/{id}/ack`
- `POST /api/nd/attestation`
- `POST /api/nd/chat/send`
- `POST /api/nd/commands`
- `POST /api/nd/commands/{id}/result`
- `POST /api/nd/connect`
- `POST /api/nd/dlp-events`
- `POST /api/nd/enroll`
- `POST /api/nd/file-transfer`
- `POST /api/nd/fleet/software`
- `POST /api/nd/fleet/task-result`
- `POST /api/nd/heartbeat`
- `POST /api/nd/help-request`
- `POST /api/nd/help-requests/{id}/accept`
- `POST /api/nd/help-requests/{id}/resolve`
- `POST /api/nd/inventory`
- `POST /api/nd/notifications/read-all`
- `POST /api/nd/notifications/{id}/read`
- `POST /api/nd/operator/login`
- `POST /api/nd/operator/sessions`
- `POST /api/nd/register`
- `POST /api/nd/register-request`
- `POST /api/nd/remote-agent-token`
- `POST /api/nd/rules`
- `POST /api/nd/scaling/relay-heartbeat`
- `POST /api/nd/smtp/test`
- `POST /api/nd/telemetry`
- `POST /api/tickets/nd`
- `PUT /api/nd/smtp`

Making API tokens needs a browser session: a token never makes another token.

- `POST /api/panel/api-tokens`

Part of the remote viewer, which runs in the browser.

- `GET /api/remote/desk`
- `GET /api/remote/session/{deviceId}`
- `GET /api/remote/viewer/{deviceId}`
- `POST /api/mesh/devices/{id}/desktop`

Saved sign-in is used by a person in the browser viewer for the session it holds; the console refuses API tokens there.

- `POST /api/devices/{id}/signin/use`

Signing in and out, second factors, passwords and sessions happen in the browser; API tokens cannot use them.

- `GET /api/auth/login-page`
- `GET /api/auth/oidc/authorize`
- `GET /api/auth/oidc/callback`
- `GET /api/auth/oidc/session`
- `GET /api/auth/oidc/status`
- `GET /api/auth/sessions`
- `GET /api/auth/totp/status`
- `GET /api/oidc/callback`
- `GET /api/settings/two-factor`
- `GET /logout`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/password`
- `POST /api/auth/totp/disable`
- `POST /api/auth/totp/enable`
- `POST /api/auth/totp/recovery-codes`
- `POST /api/auth/totp/required/enable`
- `POST /api/auth/totp/required/setup`
- `POST /api/auth/totp/setup`
- `POST /api/auth/totp/verify`
- `POST /logout`
- `PUT /api/settings/two-factor`

The RustDesk client API: desktop clients call it with their own sign-in.

- `ALL /api/currentUser`
- `ALL /api/peers/list`
- `DELETE /api/strategies/{guid}`
- `GET /api/ab`
- `GET /api/ab/personal`
- `GET /api/ab/tags`
- `GET /api/audit`
- `GET /api/audit/alarm`
- `GET /api/audit/conn`
- `GET /api/audit/file`
- `GET /api/device-group`
- `GET /api/device-group/accessible`
- `GET /api/group`
- `GET /api/group/get`
- `GET /api/login-options`
- `GET /api/peer-key/{id}`
- `GET /api/peers`
- `GET /api/server-key`
- `GET /api/server-key/fingerprint`
- `GET /api/software`
- `GET /api/software/client-download-link`
- `GET /api/strategies`
- `GET /api/strategies/{guid}`
- `GET /api/telemetry/key`
- `GET /api/user-groups`
- `GET /api/user/group`
- `POST /api/ab`
- `POST /api/ab/personal`
- `POST /api/audit/alarm`
- `POST /api/audit/conn`
- `POST /api/audit/file`
- `POST /api/device-group`
- `POST /api/group/get`
- `POST /api/heartbeat`
- `POST /api/login`
- `POST /api/logout`
- `POST /api/strategies`
- `POST /api/strategies/assign`
- `POST /api/sysinfo`
- `POST /api/sysinfo_ver`
- `POST /api/user-groups`
- `PUT /api/strategies/{guid}/status`

The browser viewer's answer to a device's password question; it needs the device's question from an open session.

- `POST /api/devices/{id}/connect-password/answer`

The same route at the /api/nd address the old console also served; the command line uses the main address.

- `DELETE /api/nd/api/panel/fleet/resources/{orgId}/{resourceId}`
- `DELETE /api/nd/api/panel/fleet/tasks/{taskId}`
- `DELETE /api/nd/api/panel/fleet/workflows/{workflowId}`
- `DELETE /api/nd/api/panel/scaling/relays/{nodeId}`
- `DELETE /api/nd/api/panel/scaling/rules/{ruleId}`
- `DELETE /api/nd/api/registrations/{id}`
- `DELETE /api/nd/policies/{id}`
- `GET /api/nd/api/enrollment/history`
- `GET /api/nd/api/enrollment/pending`
- `GET /api/nd/api/help/requests`
- `GET /api/nd/api/nd/device-policy`
- `GET /api/nd/api/nd/resource-policy`
- `GET /api/nd/api/panel/attestation`
- `GET /api/nd/api/panel/attestation/{deviceId}`
- `GET /api/nd/api/panel/fleet/availability`
- `GET /api/nd/api/panel/fleet/compliance`
- `GET /api/nd/api/panel/fleet/compliance/{deviceId}`
- `GET /api/nd/api/panel/fleet/resources/{orgId}`
- `GET /api/nd/api/panel/fleet/tasks`
- `GET /api/nd/api/panel/fleet/tasks/{taskId}`
- `GET /api/nd/api/panel/fleet/tasks/{taskId}/output`
- `GET /api/nd/api/panel/fleet/workflows`
- `GET /api/nd/api/panel/fleet/workflows/{workflowId}`
- `GET /api/nd/api/panel/fleet/workflows/{workflowId}/history`
- `GET /api/nd/api/panel/policies/{orgId}`
- `GET /api/nd/api/panel/policies/{orgId}/audit`
- `GET /api/nd/api/panel/policies/{orgId}/effective/{deviceId}`
- `GET /api/nd/api/panel/resource-control/compliance`
- `GET /api/nd/api/panel/resource-control/devices`
- `GET /api/nd/api/panel/resource-control/org-policy`
- `GET /api/nd/api/panel/resource-control/policies/{deviceId}`
- `GET /api/nd/api/panel/scaling/capacity`
- `GET /api/nd/api/panel/scaling/relays`
- `GET /api/nd/api/panel/scaling/relays/{nodeId}`
- `GET /api/nd/api/panel/scaling/relays/{nodeId}/health`
- `GET /api/nd/api/panel/scaling/relays/{nodeId}/metrics`
- `GET /api/nd/api/panel/scaling/rules`
- `GET /api/nd/api/registrations`
- `GET /api/nd/api/registrations/count`
- `GET /api/nd/api/registrations/enrollment-ui`
- `GET /api/nd/api/registrations/{id}`
- `GET /api/nd/events`
- `GET /api/nd/policies`
- `GET /api/nd/policies/{id}`
- `GET /api/nd/stats`
- `GET /api/nd/transfers`
- `GET /api/nd/transfers/{id}`
- `GET /api/nd/transfers/{id}/download`
- `PATCH /api/nd/policies/{id}`
- `POST /api/nd/api/enrollment/approve/{id}`
- `POST /api/nd/api/enrollment/clear-rejection/{id}`
- `POST /api/nd/api/enrollment/reject/{id}`
- `POST /api/nd/api/help/requests/{id}/accept`
- `POST /api/nd/api/help/requests/{id}/resolve`
- `POST /api/nd/api/nd/attestation`
- `POST /api/nd/api/nd/fleet/software`
- `POST /api/nd/api/nd/fleet/task-result`
- `POST /api/nd/api/nd/scaling/relay-heartbeat`
- `POST /api/nd/api/panel/fleet/compliance/{deviceId}/remediate`
- `POST /api/nd/api/panel/fleet/compliance/{deviceId}/scan`
- `POST /api/nd/api/panel/fleet/resources/{orgId}`
- `POST /api/nd/api/panel/fleet/tasks`
- `POST /api/nd/api/panel/fleet/tasks/{taskId}/retry`
- `POST /api/nd/api/panel/fleet/workflows`
- `POST /api/nd/api/panel/fleet/workflows/{workflowId}/execute`
- `POST /api/nd/api/panel/resource-control/policies/{deviceId}/disks`
- `POST /api/nd/api/panel/resource-control/policies/{deviceId}/monitors`
- `POST /api/nd/api/panel/resource-control/policies/{deviceId}/optical`
- `POST /api/nd/api/panel/resource-control/policies/{deviceId}/quotas`
- `POST /api/nd/api/panel/resource-control/policies/{deviceId}/usb`
- `POST /api/nd/api/panel/scaling/relays`
- `POST /api/nd/api/panel/scaling/rules`
- `POST /api/nd/policies`
- `POST /api/nd/transfer`
- `POST /api/nd/transfers/{id}/cancel`
- `PUT /api/nd/api/panel/fleet/resources/{orgId}/{resourceId}`
- `PUT /api/nd/api/panel/fleet/tasks/{taskId}`
- `PUT /api/nd/api/panel/fleet/workflows/{workflowId}`
- `PUT /api/nd/api/panel/policies/{orgId}/connection`
- `PUT /api/nd/api/panel/policies/{orgId}/features`
- `PUT /api/nd/api/panel/policies/{orgId}/network`
- `PUT /api/nd/api/panel/policies/{orgId}/security`
- `PUT /api/nd/api/panel/policies/{orgId}/update`
- `PUT /api/nd/api/panel/resource-control/org-policy`
- `PUT /api/nd/api/panel/scaling/relays/{nodeId}`
- `PUT /api/nd/api/panel/scaling/rules/{ruleId}`
- `PUT /api/nd/api/registrations/{id}/approve`
- `PUT /api/nd/api/registrations/{id}/reject`

Used by the person who got a link or the device that joins with it, not by an admin.

- `GET /api/d/{publicId}/download/{platform}/{arch}/{format}`
- `GET /api/d/{publicId}/manifest`
- `GET /api/d/{publicId}/page`
- `GET /api/guest/access-links/peers`
- `GET /api/guest/access-links/validate`
- `GET /api/mesh/share/validate`
- `GET /api/onboard/public/{code}`
- `GET /api/onboard/public/{code}/download`
- `GET /api/public/server-attestation`
- `GET /api/remote/guest-info`
- `GET /api/remote/login-info`
- `GET /api/support/session`
- `GET /downloads/generic-agent/{tag}/{name}`
- `GET /join/{code}/install.sh`
- `GET /register-status`
- `GET /s/{code}/run.sh`
- `POST /api/guest/mesh/devices/{id}/desktop`
- `POST /api/invitations/lookup`
- `POST /api/invitations/redeem`
- `POST /api/onboard/join`
- `POST /api/support/redeem`
- `POST /api/support/session/consent`
- `POST /api/support/session/device`
- `POST /api/support/session/end`
- `POST /api/support/session/password`
- `POST /register-request`

What the web console loads for its own pages and layout.

- `GET /api/console/bootstrap`
- `GET /api/console/strings/{code}`
- `GET /api/desktop/layout`
- `GET /api/desktop/wallpapers`
- `GET /api/settings/appearance`
- `GET /api/settings/themes`
- `GET /api/ui-shell`
- `POST /api/desktop/layout`
- `POST /api/ui-shell`

Your own profile: change it in the console. API tokens cannot change their account's profile.

- `PUT /api/users/me/profile`
