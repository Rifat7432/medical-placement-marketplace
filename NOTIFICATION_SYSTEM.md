# Notification System Implementation Guide

## Overview
I've implemented a comprehensive notification system for your Medical Placement Marketplace that notifies Students, Hospitals, and Admins about key events in the system.

---

## 📁 Files Created/Modified

### 1. **Notification Helper** - NEW FILE
**File:** `src/helpers/notificationHelper.ts`

- **`createNotification()`** - Creates individual notifications
- **`createBulkNotifications()`** - Creates notifications for multiple users
- **Predefined Messages** - Centralized notification templates for consistency

**Key Features:**
- Type-safe notification creation
- Error logging for failed notifications
- Automatic socket.io integration (via Notification model hook)

---

## 📢 Notification Types & Events

### **STUDENT NOTIFICATIONS**

#### 1. **Account Registration** ✅
- **When:** Student signs up
- **File:** `src/app/modules/user/user.service.ts` (createStudentToDB)
- **Message:** "Welcome to Medical Placement Marketplace"
- **Type:** SYSTEM

#### 2. **Placement Enquiry Created** ✅
- **When:** Student creates a placement enquiry
- **File:** `src/app/modules/studentPlacementEnquiry/studentPlacementEnquiry.service.ts`
- **Message:** "Your placement enquiry has been submitted successfully"
- **Type:** ALERT

#### 3. **Enquiry Approved** ✅
- **When:** Admin approves student's enquiry
- **File:** `src/app/modules/admin/admin.service.ts` (changeStudentPlacementEnquiryStatus)
- **Message:** "Your placement enquiry has been approved by admin"
- **Type:** ALERT

#### 4. **Enquiry Rejected** ✅
- **When:** Admin rejects student's enquiry
- **File:** `src/app/modules/admin/admin.service.ts` (changeStudentPlacementEnquiryStatus)
- **Message:** "Your placement enquiry has been rejected"
- **Type:** ALERT

#### 5. **Matching Started** ✅
- **When:** Admin changes stage to "matching required"
- **File:** `src/app/modules/admin/admin.service.ts` (changeStudentPlacementEnquiryStage)
- **Message:** "Your placement matching process has started"
- **Type:** ALERT

#### 6. **New Placement Match** ✅
- **When:** Admin matches placements with student
- **File:** `src/app/modules/admin/admin.service.ts` (matchPlacement)
- **Message:** "A new placement has been matched for you"
- **Type:** APPOINTMENT

#### 7. **Payment Successful** ✅
- **When:** Payment is processed successfully
- **File:** `src/helpers/stripe/handleStripeWebhook.ts`
- **Message:** "Your payment has been processed successfully"
- **Type:** PAYMENT

#### 8. **Payment Failed** ✅
- **When:** Payment transaction fails
- **File:** `src/helpers/stripe/handleStripeWebhook.ts`
- **Message:** "Your payment could not be processed"
- **Type:** ALERT

#### 9. **Message from Hospital** ✅
- **When:** Hospital sends a message
- **File:** `src/app/modules/message/message.service.ts`
- **Message:** "You have received a new message from a hospital"
- **Type:** ALERT

#### 10. **Enquiry Sent to Hospitals** ✅
- **When:** Student makes enquiry visible to hospitals
- **File:** `src/app/modules/studentPlacementEnquiry/studentPlacementEnquiry.service.ts` (sendToHospital)
- **Message:** "Your placement enquiry has been sent to hospitals"
- **Type:** ALERT

---

### **HOSPITAL NOTIFICATIONS**

#### 1. **Account Registration** ✅
- **When:** Hospital signs up
- **File:** `src/app/modules/user/user.service.ts` (createHospitalToDB)
- **Message:** "Your hospital account has been created successfully"
- **Type:** SYSTEM

#### 2. **Placement Posted** ✅
- **When:** Hospital creates a new placement
- **File:** `src/app/modules/placement/placement.service.ts` (createPlacementToDB)
- **Message:** "Your placement has been successfully posted"
- **Type:** ALERT

#### 3. **Placement Deleted** ✅
- **When:** Hospital deletes a placement
- **File:** `src/app/modules/placement/placement.service.ts` (deletePlacement)
- **Message:** "Your placement has been removed from the marketplace"
- **Type:** ALERT

#### 4. **New Student Application** ✅
- **When:** Admin matches a student to hospital's placement
- **File:** `src/app/modules/admin/admin.service.ts` (matchPlacement)
- **Message:** "A student has been matched with your placement"
- **Type:** APPOINTMENT

#### 5. **Student Approves Application** ✅
- **When:** Student approves hospital's offer
- **File:** `src/app/modules/studentPlacementEnquiry/studentPlacementEnquiry.service.ts` (updateHospitalStatusPlacementEnquiry)
- **Message:** "A student has approved your placement offer"
- **Type:** ALERT

#### 6. **Student Rejects Application** ✅
- **When:** Student rejects hospital's offer
- **File:** `src/app/modules/studentPlacementEnquiry/studentPlacementEnquiry.service.ts` (updateHospitalStatusPlacementEnquiry)
- **Message:** "A student has declined your placement offer"
- **Type:** ALERT

#### 7. **Message from Student** ✅
- **When:** Student sends a message
- **File:** `src/app/modules/message/message.service.ts`
- **Message:** "You have received a new message from a student"
- **Type:** ALERT

---

### **ADMIN NOTIFICATIONS**

#### 1. **New Student Registration** ✅
- **When:** Student signs up
- **File:** `src/app/modules/user/user.service.ts` (createStudentToDB)
- **Message:** "A new student has registered on the platform"
- **Type:** ADMIN

#### 2. **New Hospital Registration** ✅
- **When:** Hospital signs up
- **File:** `src/app/modules/user/user.service.ts` (createHospitalToDB)
- **Message:** "A new hospital has registered on the platform"
- **Type:** ADMIN

#### 3. **New Placement Enquiry** ✅
- **When:** Student creates a placement enquiry
- **File:** `src/app/modules/studentPlacementEnquiry/studentPlacementEnquiry.service.ts`
- **Message:** "A new student placement enquiry requires your review"
- **Type:** ADMIN

#### 4. **New Placement Posted** ✅
- **When:** Hospital creates a new placement
- **File:** `src/app/modules/placement/placement.service.ts` (createPlacementToDB)
- **Message:** "A new placement has been posted by a hospital"
- **Type:** ADMIN

#### 5. **Payment Received** ✅
- **When:** Student makes a successful payment
- **File:** `src/helpers/stripe/handleStripeWebhook.ts`
- **Message:** "A payment has been successfully processed"
- **Type:** PAYMENT

#### 6. **Payment Failed** ✅
- **When:** Payment transaction fails
- **File:** `src/helpers/stripe/handleStripeWebhook.ts`
- **Message:** "A payment transaction has failed"
- **Type:** ALERT

---

## 🔧 How to Use

### Basic Usage in Your Services

```typescript
// Import the helper
import { createNotification, notificationMessages } from '../../../helpers/notificationHelper';

// Send a notification
await createNotification({
     receiver: userId,
     title: notificationMessages.STUDENT_SIGNUP.title,
     message: notificationMessages.STUDENT_SIGNUP.message,
     type: notificationMessages.STUDENT_SIGNUP.type,
});
```

### Creating Custom Notifications

```typescript
// For custom messages not in predefined templates
await createNotification({
     receiver: userId,
     title: 'Custom Title',
     message: 'Your custom message here',
     type: 'ALERT', // or 'SYSTEM', 'PAYMENT', 'ADMIN', 'APPOINTMENT', 'CANCELLED'
});
```

### Bulk Notifications

```typescript
import { createBulkNotifications } from '../../../helpers/notificationHelper';

await createBulkNotifications(
     [userId1, userId2, userId3],
     'Title',
     'Message',
     'SYSTEM'
);
```

---

## 📊 Notification Types

| Type | Usage | Example |
|------|-------|---------|
| **ADMIN** | Admin-specific alerts | New registration, payment info |
| **SYSTEM** | General system messages | Welcome message, important updates |
| **PAYMENT** | Payment-related | Payment success/failure |
| **ALERT** | Important alerts | Status changes, rejections |
| **APPOINTMENT** | Placement matches | New placement match, approvals |
| **CANCELLED** | Cancellations | Placement cancelled |

---

## 🔌 Real-Time Socket.IO Integration

All notifications automatically emit to connected users via socket.io through the Notification model's post-save hook:

```typescript
// Automatic socket.io emit happens in notification.model.ts
socketIo.to(receiverId).emit('notification', notification);
```

No additional setup needed! Clients listening to the `notification` event will receive updates in real-time.

---

## 📈 Key Benefits

✅ **Comprehensive Coverage** - All major user actions trigger notifications
✅ **Type-Safe** - TypeScript ensures correct notification types
✅ **Centralized Messages** - Easy to update notification text in one place
✅ **Consistent Formatting** - All notifications follow the same pattern
✅ **Real-Time** - Socket.io integration for instant delivery
✅ **Error Handling** - Failed notifications are logged, not silently ignored
✅ **Scalable** - Easy to add new notifications without changing core code

---

## 🚀 Next Steps (Optional)

1. **Notification Dashboard** - Create a UI to display all notifications
2. **Email Notifications** - Add email alerts for important events
3. **Notification Preferences** - Allow users to customize which events trigger notifications
4. **Notification Archive** - Store notification history with a TTL
5. **Push Notifications** - Add web push or mobile push support

---

## 📝 Testing the Notifications

1. **Sign up a student** → Check for "Welcome" notification
2. **Create an enquiry** → Both student and admin should get notifications
3. **Make a payment** → Student and admin get payment notifications
4. **Admin approves enquiry** → Student gets "Approved" notification
5. **Admin matches placement** → Student gets placement match, hospital gets new application
6. **Send a message** → Recipient gets message notification

---

## 🔍 Troubleshooting

**Notifications not showing?**
- Check if Notification model is importing correctly
- Verify socket.io is initialized in your app
- Check browser console for JavaScript errors
- Check database logs for insertion errors

**Wrong receiver?**
- Verify the `receiver` field matches user `_id` (ObjectId)
- Check that user exists in the database

**Socket.io not emitting?**
- Ensure socket.io is properly configured
- Check that client is listening to the `notification` event
