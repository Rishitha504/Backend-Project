CREATE TABLE password_reset_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    otp VARCHAR(6) NOT NULL,

    expires_at DATETIME NOT NULL,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);