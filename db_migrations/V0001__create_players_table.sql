CREATE TABLE t_p28465274_crm_site_black_orang.players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  nickname VARCHAR(64) NOT NULL,
  avatar_letter CHAR(1) NOT NULL DEFAULT 'P',
  faction VARCHAR(64) DEFAULT 'Без фракции',
  rank VARCHAR(64) DEFAULT 'Новобранец',
  money INTEGER DEFAULT 5000,
  bank INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  hours_played INTEGER DEFAULT 0,
  warnings INTEGER DEFAULT 0,
  session_token VARCHAR(128) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
