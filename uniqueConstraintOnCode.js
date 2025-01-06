-- إنشاء جدول مع قيد فريد على الكود
CREATE TABLE activation_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,  -- هذا يضمن عدم تكرار الكود
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
