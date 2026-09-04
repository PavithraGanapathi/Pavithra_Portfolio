
use admin;
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    tech_stack VARCHAR(255),
    github_link VARCHAR(255),
    image_url VARCHAR(255)
);

CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT
);

CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    password VARCHAR(255)
);

INSERT INTO admin (username, password) VALUES ('pavi_admin', 'pk31s');