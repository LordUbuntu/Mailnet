CREATE DATABASE records;
USE records;

-- Table definition
CREATE TABLE sent_mail (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body VARCHAR(255) NOT NULL,
);

-- Add data
INSERT INTO sent_mail (sender, target, subject, body) 
VALUES ('', '', '', '');
