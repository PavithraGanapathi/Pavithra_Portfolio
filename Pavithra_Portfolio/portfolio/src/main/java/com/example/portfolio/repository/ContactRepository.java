package com.example.portfolio.repository;

import com.example.portfolio.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact , Integer>{
}
