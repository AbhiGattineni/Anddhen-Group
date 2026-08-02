# Anddhen Firestore Schema (21 collections)

One collection per Django model. Collection names mirror the Django `db_table` so a
future Django reconnect maps 1:1. Field names are preserved from the models.

**Translation conventions (apply everywhere):**
- **doc id** — Firestore auto-id unless an `id field` is noted (natural key).
- **FK `X`** → stored as `X_id` (string doc-id of the referenced doc); optionally a
  denormalized display field (noted per collection).
- **JSONField** → native array/map.
- **Date / DateTime** → Firestore `Timestamp`.
- **FileField / ImageField** → uploaded to Storage; field holds the download URL.
- **auto_now_add / auto_now** → `createdAt` / `updatedAt` via `serverTimestamp()`.
- **choices** → validated in adapter + rules (Firestore has no enum).
- **unique / unique_together** → enforced by query-before-write in the adapter.

---

### 1. `todos`  (Todo)
`task` str · `completed` bool · `user_id` str→User · `createdAt` ts(auto) · `updatedAt` ts(auto)

### 2. `persons`  (Person)
`name` str · `email` str · `phone` str · `dob` ts · `address` str

### 3. `PartTimer`  (PartTimer)
`user` str · `answered_questions` bool · `current_occupation` str · `year_of_study` str ·
`course_name` str · `referred_by` str

### 4. `role`  (Role)
`user_id` str · `name` str · `role_name` str

### 5. `collegelist`  (CollegesList)  — admin-writable
`college_name` str · `website_link` url · `international_UG_link` url ·
`international_graduation_link` url · `application_UG_link` url ·
`application_graduation_link` url · `application_UG_fee` str · `application_UG_fee_link` url ·
`application_graduation_fee` str · `application_graduation_fee_link` url · `gre_score` str ·
`gre_score_link` url · `toefl_UG_score` str · `toefl_UG_score_link` url ·
`toefl_graduation_score` str · `toefl_graduation_score_link` url · `ielts_ug_score` str ·
`ielts_ug_score_link` url · `ielts_graduation_score` str · `ielts_graduation_score_link` url ·
`fall_deadline_UG` str · `fall_deadline_UG_link` url · `fall_deadline_graduation` str ·
`fall_deadline_graduation_link` url · `spring_deadline_UG` str · `spring_deadline_UG_link` url ·
`spring_deadline_graduation` str · `spring_deadline_graduation_link` url · `college_email` str ·
`college_email_link` url · `college_phone` str · `college_phone_link` url ·
`international_person_email` str · `international_person_email_link` url ·
`public_private` enum(public|private) · `UG_courses` str · `UG_courses_link` url ·
`graduation_courses` str · `graduation_courses_link` url · `state` str

### 6. `social_links`  (CollegeDetail)  — admin-writable
`college_id` str→collegelist · `college_name` str · `label` str · `link` url

### 7. `access_roles`  (AccessRoles)  — admin-writable
`admin_access_role` str · `name_of_role` str

### 8. `employer_details`  (Employer)
`name` str · `address` str

### 9. `recrutier_details`  (Recruiter)
`name` str · `phone` str **unique** · `employer` str · `email` str

### 10. `consultant_details`  (Consultant)
`employer_id` str→employer_details · `recruiter_id` str→recrutier_details ·
`full_name` str · `full_name_verified` bool · `phone_number` str **unique** · `email_id` str ·
`dob` ts · `visa_status` enum(OPT|CPT|H1B|H4 EAD) · `visa_status_verified` bool ·
`visa_validity` ts · `visa_validity_verified` bool · `btech_college` str ·
`btech_percentage` num · `btech_graduation_date` ts · `masters_college` str ·
`masters_cgpa` num · `masters_graduation_date` ts · `technologies` array<str> ·
`current_location` str · `relocation` bool · `experience_in_us` str ·
`experience_in_us_verified` bool · `experience_in_india` str ·
`experience_in_india_verified` bool · `relocation_preference` str · `passport_number` str ·
`passport_number_verified` bool · `driving_licence` str · `rate_expectations` str ·
`last_4_ssn` str · `linkedin_url` url · `linkedin_url_verified` bool · `uploaded_date` ts ·
`original_resume` url(Storage resumes/) · `consulting_resume` url(Storage resumes/)

### 11. `status_consultant`  (StatusConsultant)
`consultant_id` str→consultant_details · `recruiter_id` str→recrutier_details ·
`employer_id` str→employer_details · `date` ts · `description` str

### 12. `User`  (User)  — **id field: `user_id`** (== Firebase auth uid)
`user_id` str(pk) · `full_name` str · `first_name` str · `last_name` str ·
`phone_country_code` str · `phone_number` str · `email_id` str · `enrolled_services` array/map

### 13. `Packages`  (Package)  — admin-writable
`package_name` str · `includes` array<str> · `excludes` array<str> · `package_for` str

### 14. `PartTimer_status`  (AcsParttimerStatus)
`parttimerName` str · `parttimerId` str · `studentName` str · `studentId` str · `date` ts ·
`applicationsAppliedSearched` int · `applicationsAppliedSaved` int · `easyApply` int ·
`recruiterDirectMessages` str · `connectMessages` str · `reason` str · `description` str

### 15. `Status_updates`  (StatusUpdates)
`user_id` str · `user_name` str · `subsidary` str · `source` str · `date` ts · `description` str ·
`studentName` str · `whatsappId` str · `applicationsAppliedSearched` int ·
`applicationsAppliedSaved` int · `easyApply` int · `recruiterDirectMessages` str ·
`connectMessages` str · `reason` str · `ticket_link` str · `github_link` str · `account_name` str ·
`stock_name` str · `stock_quantity` int · `stock_value` num ·
`transaction_type` enum(buy|sell) · `total_current_amount` num · `pickup_location` str ·
`pickup_contact` str · `dropoff_location` str · `dropoff_contact` str · `distance_travelled` num ·
`whatsapp_group_number` str · `leave` bool

### 16. `ShopingProduct`  (ShopingProduct)
`name` str · `image` url(Storage products/) · `link` url · `age_group` str · `description` str

### 17. `team_member`  (TeamMember)
`name` str · `work_time_from` ts · `work_time_to` ts · `role` str · `description` str ·
`image` url(Storage team_members/) · `facebook_link` url · `linkedin_link` url ·
`github_link` url · `subsidiary` str

### 18. `device_allocation`  (DeviceAllocation)
`device_type` str · `device_name` str · `about_device` str · `allocated_to` str ·
`from_date` ts · `to_date` ts · `purpose` str

### 19. `happiness_index`  (HappinessIndex)  — **unique (`employee_id`,`date`)**
`employee_id` str→User · `happiness_score` int · `description` str · `date` ts

### 20. `subsidiary`  (Subsidiary)  — admin-writable
`subsidiaryName` str · `subName` str · `parttimer_multi_status` bool · `active` bool

### 21. `transactions`  (Transaction)  — **id field: `transaction_id`** (nanoid, was shortuuid)
`transaction_id` str **unique** · `receiver_name` str · `receiver_id` str · `sender_name` str ·
`sender_id` str · `accountant_name` str · `accountant_id` str · `credited_amount` num ·
`debited_amount` num · `transaction_datetime` ts · `uploaded_datetime` ts ·
`transaction_type` enum(credit|debit) · `payment_type` enum(cash|upi|bank_transfer) ·
`subsidiary` enum(AMS|ACS|ASS|APS|ATI) · `currency` str · `description` str

---

## Compute (NOT collections — Cloud Functions / Django)
- `parseResume`  ← Django `POST /api/parse-resume/`
- `defaultWords` ← Django `GET /api/default-words/`
- finance_agent services, AI suggestions, house-price predictor
