package com.example.portfolio.service;

import com.example.portfolio.model.Contact;
import com.example.portfolio.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    @Autowired
    private ContactRepository repo;

    public List<Contact> getAllContacts() {
        return repo.findAll();
    }

    public Contact saveContact(Contact contact) {
        return repo.save(contact);
    }
}