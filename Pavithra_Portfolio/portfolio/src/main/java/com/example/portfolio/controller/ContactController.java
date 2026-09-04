package com.example.portfolio.controller;

import com.example.portfolio.model.Contact;
import com.example.portfolio.service.ContactService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin
public class ContactController {

    @Autowired
    private ContactService service;


    @PostMapping
    public Contact saveContact(@RequestBody Contact contact) {
        return service.saveContact(contact);
    }


    @GetMapping
    public List<Contact> getAllContacts() {
        return service.getAllContacts();
    }
}