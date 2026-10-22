# Analytics, ads and cookie consent setup

## What the site does

- Shows the same first-level options in Portuguese and English: accept all, reject optional categories, or manage preferences.
- Keeps analytics, advertising and external YouTube media disabled until the visitor opts in. Necessary local storage only remembers the consent choice.
- Stores the choice in the browser for up to 180 days. Visitors can reopen settings or revoke their choice through **Cookie settings / Configurar cookies** in the footer.
- Sets Google Consent Mode v2 defaults to denied before any GTM script is loaded, then updates the consent state when the visitor saves a choice.
- Loads GTM only if analytics or advertising is allowed. YouTube thumbnails, the iframe API and the player only load when external media is allowed.
- Does not load any optional vendor tag until `NEXT_PUBLIC_GTM_ID` has a valid container ID.

The project has no GTM, GA4, Meta, TikTok or Google Ads account IDs. Those destinations and their tags are managed in the GTM web container; this project supplies the consent state and event data layer.

## 1. Connect the GTM container

1. Create or choose a **Web** container in [Google Tag Manager](https://tagmanager.google.com/).
2. Copy its ID, in the `GTM-XXXXXXX` format.
3. Add `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` to `.env.local` for local use and to the production deployment environment, then redeploy. The container ID is public configuration, not a secret.
4. Create GA4, Meta, TikTok and Google Ads tags in this container only if you have created those accounts and want to use those destinations.

## 2. Configure consent-aware triggers in GTM

The site sends Google Consent Mode v2 values before GTM starts:

| Site choice | Google consent values |
| --- | --- |
| Analytics | `analytics_storage=granted` |
| Advertising | `ad_storage`, `ad_user_data`, `ad_personalization` and `personalization_storage` are granted |
| No choice / rejected | Optional consent values stay denied |

Use these data layer events and flags as the trigger source:

| Event | Data sent | Use |
| --- | --- | --- |
| `page_view` | `page_location`, `page_title` | Initial page view after an optional category is granted |
| `cta_click` | `cta_location`, `cta_label` | Hero proposal or demo CTA |
| `contact_click` | `contact_method` (`whatsapp`, `email`, `instagram`) | Main lead/contact conversion |
| `demo_open` | `game_name` | A visitor opens a demo video |
| `video_start` | `game_name` | Video playback starts |
| `video_progress` | `game_name`, `percent` (`25`, `50`, `75`, `100`) | Video progress milestones |
| `analytics_consent_granted` | Consent flags | Analytics initialization after consent |
| `marketing_consent_granted` | Consent flags | Advertising initialization after consent |

Every interaction event includes `analytics_consent` and `marketing_consent` booleans. Create Data Layer Variables for them and use them to gate destination tags:

All events also include a sanitized `page_location` and `page_title`. The URL is limited to the path and known campaign parameters (`utm_*`); known ad click IDs are included only when advertising consent is granted. Other query parameters are removed.

- **GA4:** fire the Google tag on `analytics_consent_granted`, with Consent Mode enabled and its tag firing option set to once per page. Send the supplied `page_view` event and GA4 event tags only when `analytics_consent` is `true`. Turn off automatic page view on the Google tag if you use the supplied `page_view` event, so the first view is not counted twice. Mark `contact_click` as a key event in GA4.
- **Meta Pixel:** use the Meta Pixel template/base code for `PageView` on `marketing_consent_granted`, with the base tag set to fire once per page. Send the relevant `contact_click`, `cta_click`, `demo_open` and video events only when `marketing_consent` is `true`. Map the lead/contact event to the standard Meta event you choose.
- **TikTok Pixel:** use TikTok's GTM integration/template for the base pixel on `marketing_consent_granted`, set to fire once per page; define event tags for the events you want, gated by `marketing_consent`.
- **Google Ads:** fire conversion and remarketing tags only after `marketing_consent_granted`; retain their built-in Consent Mode checks. `contact_click` is the likely lead conversion event. Add a conversion linker only with the same marketing-consent rule.

Do not set non-essential destination tags to an unrestricted **All Pages** trigger. For Meta/TikTok or other tags without built-in Google consent checks, also require marketing consent in the tag's GTM consent settings. Google tags have built-in consent checks; use Google's Consent Mode behavior rather than adding conflicting duplicate checks. Confirm the settings on every tag in GTM's Consent Overview.

## 3. Publish and check the configuration

1. Use GTM Preview / Tag Assistant. Before choosing consent, confirm that the GTM script and vendor tags have not loaded.
2. Choose analytics only. Confirm GA4 tags can fire and advertising tags do not.
3. Choose advertising only. Confirm advertising tags can fire and GA4 events do not.
4. Reject optional categories. Confirm no optional tags fire. Then open **Cookie settings / Configurar cookies** in the footer, enable one category and check that consent updates without a page refresh.
5. Confirm the events in GA4 DebugView, Meta Events Manager Test Events and TikTok Events Manager. Keep the GTM Preview session open while checking.
6. Publish the GTM container after the Preview checks. A saved GTM workspace is not live until published.

Use the current vendor instructions for [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [GTM consent settings](https://support.google.com/tagmanager/answer/10718549), and [TikTok Pixel through GTM](https://ads.tiktok.com/resources/help/article/how-to-set-up-tiktok-pixel-in-google-tag-manager). Google recommends GTM for managing Analytics tags when GTM is already installed. The local privacy page describes the categories and event data; update the exact vendor cookie/identifier retention periods there after choosing and configuring your tags.

## Consent and privacy note

The banner provides an opt-in interface and a direct way to change or revoke choices. The privacy notice is available at `/pt/privacy` and `/en/privacy`. This implementation is a technical baseline, not a legal review. Before enabling production tags, confirm the final purposes, retention periods, vendor settings and privacy notice for the exact accounts and tags you activate.
