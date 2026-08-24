# Regional Finance Loan Flow Prototype

## Purpose

This is a self-contained, clickable mobile prototype for evaluating the proposed Regional Finance online loan journey. It is a demonstration only, uses fictional data, and must not make real credit, banking, funding, or authentication requests.

The supplied Figma screenshots and approved mockups are the visual source of truth. Do not add badges, summaries, confirmation graphics, copy, or UI elements that are not present in those designs unless specifically requested.

## Deliverable

- Primary file: `index.html`
- Keep the prototype in one HTML file when practical.
- Bootstrap, Bootstrap Icons, and approved Regional Finance web assets may load from their existing CDNs.
- The file should work locally and when uploaded to GitHub Pages.

## Demo controls

- Desktop: show a left-side control panel with Reset, Known Customer, Unknown Customer, and Offer Code.
- Mobile: replace the large panel with a subtle, transparent floating gear button that opens the flow controls.
- The initial chooser screen should link to all three flows.
- Reset must clear the prototype state, including authentication, checkboxes, selections, and entered data.
- Selecting a different demo flow starts a fresh customer session and clears authentication inherited from the previously tested flow.

## Flow definitions

The landing-page flow chooser should identify the intended audiences:

- Known Customer: former customers, affiliate audiences, and other known customers whose information we already have.
- New Customer: new customers whose information we do not have yet.
- Offer Code Customer: direct-mail recipients entering an offer code whose information we already have.

### Known Customer

1. Confirm phone number
2. SMS OTP
3. Is this you?
4. Ready for your instant decision?
5. Checking for offers
6. Pre-qualified offer
7. Save offer
8. Email OTP
9. Bank verification
10. Final credit authorization
11. Processing
12. Choose funding account
13. Review and sign agreement
14. Funded confirmation

Selecting “This isn’t my phone number” starts the Unknown Customer flow.

### Offer Code Customer

1. Offer/reservation-code landing page
2. Confirm phone number
3. SMS OTP
4. Is this you?
5. Ready for your instant decision?
6. Continue through the shared offer and completion journey

The reservation number must be an editable input, not a fake populated field.

### Unknown Customer

1. “You’re just a minute away from an instant decision” — first name, last name, and date of birth
2. “A bit more about you” — address and home ownership
3. “A few last details” — annual income and Social Security number
4. Confirm your information and enter a mobile number
5. SMS OTP
6. Ready for your instant decision?
7. Continue through the shared offer and completion journey

Unknown-customer fields must start blank. The prototype does not know the customer’s name, birth date, address, income, SSN, phone number, or email before the customer provides them.

## Authentication behavior

- SMS OTP fields start empty.
- After the SMS OTP page loads, show a simulated iOS Messages notification from Regional Finance.
- The notification displays code `429833` and a “Tap to prefill” action.
- Only tapping “Tap to prefill” fills the six OTP boxes.
- Do not show a simulated keyboard.
- Email OTP fields start empty and must be entered manually. Do not show an SMS notification or prefill control for email OTP.
- Once an OTP has been completed, treat that channel as authenticated when revisiting screens. Reset clears authentication.

## Inputs and state

- All consent checkboxes start unchecked.
- Autopay starts off and is selectable.
- Funding accounts must be selectable; Confirm should reflect the selection state.
- Format phone numbers while typing.
- Format income as currency with thousands separators.
- Format names cleanly on blur.
- Show SSN digits while the customer types, then mask them after entry loses focus.
- Address entry should show simulated autocomplete suggestions suitable for a static prototype.
- Back and edit paths should preserve plausible state.
- New Customer name, birth date, address, home ownership, income, SSN, phone, and email entries must persist and appear consistently on confirmation and downstream screens.
- Offer selection is stateful. Loan amount, term, APR, monthly payment, and autopay selection must remain consistent on Save Offer, credit authorization, funding, agreement, and funded-confirmation screens.
- The maximum selectable loan amount is $15,000. The amount selector supports $1,000 increments from $1,000 through $15,000.
- Loan Proceeds and Term rows expand independently to show their interactive selection states. Amount and term options must use consistent alignment and spacing.

## Terminology and data

- Use “pre-qualified” consistently. Do not use “preapproved” or “pre-approved.”
- Use fictional demo customer and account data only.
- Standard known-customer test identity: Test User, 123-456-7890, and Testuser@gmail.com.
- Display known phone numbers as `***-***-7890` on phone-confirmation and SMS OTP screens.
- Do not connect to real identity, credit, banking, document-signing, or funding services.

## Visual requirements

- Match the provided mobile mockups closely in layout, hierarchy, spacing, type size, colors, borders, and copy.
- Use the Regional Finance logo and approved assets from `myloan.regionalfinance.com` where available.
- Use a real lock icon from Bootstrap Icons or the approved icon treatment; never use a chess-piece character.
- Prefer Bootstrap Icons to Unicode symbols for settings, downloads, banking, documents, success, and security.
- Keep the phone experience responsive and usable in a real mobile browser.
- Sticky payment/offer actions should remain at the bottom of the viewport.
- Do not show prototype labels such as “FIGMA PROTOTYPE,” “FICTIONAL DATA,” or “NO CREDIT CHECK” in the customer UI.

## Bank-link simulation

- Bank linking is simulated and must never collect or transmit real credentials.
- Every customer flow must complete bank linking; no flow may inherit or bypass bank verification from another demo session.
- The final credit-authorization screen may only be entered from the bank-link success screen. The prototype must redirect any other attempted route through bank linking.
- Include bank selection/search, a realistic fictional sign-in screen, an animated connection state, and account-success state.
- Keep mobile browser behavior natural; do not simulate an operating-system keyboard.
- Use clearly fictional/demo credential guidance.
- The bank-link experience is temporary and is expected to be replaced by Plaid. Keep it aligned with the supplied mockups rather than expanding or redesigning it.
- The bank success screen shows only the bank logo, success confirmation, Continue, Add more accounts, and Yodlee attribution. Do not display a connected-account card, account name, or masked account number.

## Funded screen

Match the approved funded-screen mockup exactly:

- Step 4 of 4 header
- “Your $15,000 has been sent to your bank account.”
- Deposit timing explanation
- Direct Installment Loan Disclosure Note download card
- Credit Score Disclosure download card
- Regional Finance Portal card with Login button
- Standard footer

Do not add a success checkmark, “Funding initiated” badge, account summary, arrival summary, loan-status summary, or other extra success content.

## Future updates

- Copy will continue to change. Update the screen templates in the `render()` switch inside `index.html`.
- Shared visual rules are in the inline `<style>` blocks.
- Flow and authentication state live in the `S` object and click/input handlers near the end of the file.
- When a new screenshot conflicts with this document, the newest user-approved screenshot wins.
- After changes, test all three entry flows, Reset, mobile flow controls, both OTP experiences, bank linking, account selection, signing, sticky actions, and the funded screen.

## Design concepts

- The prototype supports multiple visual concepts without duplicating or changing the underlying customer journeys.
- **V1** is the original Regional Finance prototype styling.
- **V2** is the newer proposed direction with Poppins typography, heavier headings, pill-shaped actions, larger radii, and a light-gray footer with a rounded top edge.
- **V3** is the secure, trust-led offer direction based on `regional_finance_secure_flow.html`: Plus Jakarta Sans typography, a compact 102 × 26 logo, pill actions, pale-blue form surfaces, filled consent panels, colorful benefit cues, and a standard navy footer. Its known-customer entry includes the expanded reassurance and trust treatment; all three customer journeys continue through the same shared screens and logic.
- The selected concept persists while navigating between screens and customer flows, and it is preserved when Reset is used.
- Customers can switch concepts from the start screen or from Prototype controls (the gear button on mobile).
- The compact version picker is designed to grow cleanly to V3, V4, and V5.
- Add future versions to `DESIGN_NAMES`, the version picker/control buttons, and a scoped `.phone.design-*` CSS block. Keep business logic, customer state, loan values, and flow routing shared.
