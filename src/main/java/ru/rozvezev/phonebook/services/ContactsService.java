package ru.rozvezev.phonebook.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rozvezev.phonebook.models.Contact;
import ru.rozvezev.phonebook.repositories.ContactsRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ContactsService {

    private final ContactsRepository contactsRepository;

    public ContactsService(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
    }

    public List<Contact> getAll(){
        return contactsRepository.findAll();
    }

    public Contact getById(int id){
        return contactsRepository.findById(id).orElse(null);
    }

    @Transactional
    public void delete(int id) {
        contactsRepository.deleteById(id);
    }

    @Transactional
    public void save(Contact contact) {
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUpdatedAt(LocalDateTime.now());
        contactsRepository.save(contact);
    }

    @Transactional
    public Contact save(String name, String phoneNumber) {
        Contact contact = new Contact();
        contact.setName(name);
        contact.setPhoneNumber(phoneNumber);
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUpdatedAt(LocalDateTime.now());
        return contactsRepository.save(contact);
    }


    @Transactional
    public void update(int id, Contact contact) {
        contactsRepository.updateNameAndNumber(id, contact.getName(), contact.getPhoneNumber());
    }

    @Transactional
    public void update(int id, String name, String phoneNumber) {
        contactsRepository.updateNameAndNumber(id, name, phoneNumber);
    }

    @Transactional
    public void addSuffixToNames(String suffix){
        contactsRepository.addSuffixToNames(suffix);
    }
}
