# Testing Guide for Bureaucracy Buster

This document provides guidance on testing the Bureaucracy Buster application with various document types.

## Test Scenarios

### 1. Medical Bill
**Document Type:** Hospital or clinic bill
**Expected Output:**
- **Summary:** "This is a medical bill for services provided on [date]"
- **Action Required:** "Pay $[amount] by [method] (check, online, phone)"
- **Deadline:** Specific date (e.g., "March 30, 2025") or "Within 30 days"
- **Reassurance:** Calming message like "You've got this! Medical bills can look scary, but this is straightforward."

**What to Test:**
- Can the AI identify the total amount due?
- Does it distinguish between "total charges" and "amount due"?
- Can it find payment instructions?
- Does it identify insurance information if relevant?

### 2. Parking Ticket / Traffic Citation
**Document Type:** Parking violation or traffic ticket
**Expected Output:**
- **Summary:** "This is a parking ticket for [violation] on [date]"
- **Action Required:** "Pay $[amount] online at [website] or mail check to [address]"
- **Deadline:** Specific date (e.g., "Within 21 days" or "By January 15, 2025")
- **Reassurance:** "Don't worry - just pay this by the deadline and you're all set."

**What to Test:**
- Can it identify the fine amount?
- Does it find the citation number?
- Can it extract the payment deadline?
- Does it identify if there are early payment discounts?

### 3. Tax Document (1099, W-2, IRS Letter)
**Document Type:** Tax form or IRS correspondence
**Expected Output:**
- **Summary:** "This is a [tax form type] for tax year [year]"
- **Action Required:** "File this with your tax return by April 15" or "Respond to IRS by [date]"
- **Deadline:** Tax filing deadline or response deadline
- **Reassurance:** "Tax forms can be intimidating, but this is just documentation you'll need for filing."

**What to Test:**
- Can it identify the form type (W-2, 1099, etc.)?
- Does it understand the urgency of IRS letters?
- Can it distinguish between informational documents and action-required items?

### 4. Legal Notice / Jury Duty Summons
**Document Type:** Court summons or legal notice
**Expected Output:**
- **Summary:** "This is a jury duty summons for [court name]"
- **Action Required:** "Appear at [location] on [date] at [time]" or "Complete questionnaire and return by [date]"
- **Deadline:** Appearance date or response deadline
- **Reassurance:** "Jury duty is a civic duty. Follow the instructions and you'll be fine."

**What to Test:**
- Can it identify critical dates?
- Does it find location information?
- Can it identify what specific action is required?
- Does it distinguish between "must appear" vs "may be excused"?

### 5. Insurance Statement / EOB (Explanation of Benefits)
**Document Type:** Insurance explanation of benefits
**Expected Output:**
- **Summary:** "This is an insurance explanation of benefits for [service] on [date]"
- **Action Required:** "No payment required - this is for your records" or "You owe $[amount] to the provider"
- **Deadline:** "None" or payment deadline if applicable
- **Reassurance:** "EOBs look complicated but they're just showing what insurance covered."

**What to Test:**
- Can it distinguish between "This is not a bill" messages?
- Does it identify if patient owes money?
- Can it find the provider's name?

### 6. Utility Bill (Electric, Gas, Water)
**Document Type:** Monthly utility bill
**Expected Output:**
- **Summary:** "This is your [utility type] bill for [service period]"
- **Action Required:** "Pay $[amount] by [method]"
- **Deadline:** Due date
- **Reassurance:** "Just a regular utility bill - pay by the due date to avoid late fees."

**What to Test:**
- Can it identify the amount due?
- Does it find the due date?
- Can it extract account numbers?
- Does it identify past due amounts if applicable?

### 7. Lease Agreement / Rental Document
**Document Type:** Housing lease or rental addendum
**Expected Output:**
- **Summary:** "This is a lease agreement for [property address]"
- **Action Required:** "Sign on page [X] and return by [date]"
- **Deadline:** Signature deadline
- **Reassurance:** "Take your time to read this carefully. Make sure you understand the terms before signing."

**What to Test:**
- Can it identify where signatures are needed?
- Does it find key dates (move-in, lease end)?
- Can it identify critical terms (rent amount, deposit)?

### 8. Credit Card Statement
**Document Type:** Monthly credit card statement
**Expected Output:**
- **Summary:** "This is your [card issuer] credit card statement for [billing period]"
- **Action Required:** "Pay at least $[minimum] by [date], or pay $[full balance] to avoid interest"
- **Deadline:** Payment due date
- **Reassurance:** "Credit card statements have lots of numbers, but focus on the payment due and date."

**What to Test:**
- Can it distinguish between minimum payment and statement balance?
- Does it identify the due date?
- Can it find late payment warnings?

## Testing Process

### 1. Preparation
- Gather sample documents (redacted for privacy if using real documents)
- Take clear photos with good lighting
- Ensure text is readable in the image

### 2. During Testing
1. Open the app at http://localhost:3000
2. Upload or capture the document
3. Wait for analysis (should be < 5 seconds per PRD)
4. Review the four key outputs:
   - Reassurance message
   - What is it?
   - When is it due?
   - What do I do?

### 3. Evaluation Criteria

**Accuracy (Priority 1):**
- [ ] Summary correctly identifies document type
- [ ] Deadline is accurate (or correctly states "None")
- [ ] Action required is specific and correct
- [ ] No critical information is missed

**Usability (Priority 2):**
- [ ] Analysis completes in under 10 seconds
- [ ] Text is high contrast and easy to read
- [ ] Action item is the most prominent element
- [ ] Reassurance message is calming and appropriate

**Accessibility (Priority 3):**
- [ ] Screen reader can navigate all sections
- [ ] Buttons are large enough to tap easily (min 44x44px)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible

## Known Limitations

1. **Handwritten documents:** May have difficulty reading handwritten text
2. **Poor image quality:** Blurry or low-light photos may fail
3. **Multi-page documents:** Currently processes one page at a time
4. **Complex forms:** May miss information spread across multiple columns

## Success Metrics (From PRD)

- **Accuracy:** Does Gemini correctly identify the deadline and action in 3 test documents?
  ✅ Target: 100% accuracy on utility bill, parking ticket, and jury duty summons

- **Usability:** Can a user get from "Photo" to "Understanding" in < 10 seconds?
  ✅ Target: < 10 seconds from capture to results display

## Demo Script

For hackathon presentation:

1. **Show a complex medical bill**
   - Point out how overwhelming the original looks
   - Capture with app
   - Highlight how it simplifies to 3 key points

2. **Show a parking ticket**
   - Emphasize the reassurance message
   - Show how deadline is prominently displayed

3. **Show a legal notice**
   - Demonstrate how jargon is translated to plain language
   - Show the clear action required

**Key Message:** "We turn administrative paralysis into administrative clarity."
