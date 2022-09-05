package ru.rozvezev.phonebook.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.rozvezev.phonebook.models.Contact;
import ru.rozvezev.phonebook.services.ContactsService;

import javax.validation.Valid;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/contacts")
public class ContactsController {

    private final ContactsService contactsService;

    @Autowired
    public ContactsController(ContactsService contactsService) {
        this.contactsService = contactsService;
    }

    @GetMapping()
    public String contacts(Model model){
        model.addAttribute("contacts", contactsService.getAll());
        model.addAttribute("formatter", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return "/contact/contacts_view";
    }

    @PostMapping()
    @ResponseBody
    public ResponseEntity<Contact>  createContact(@RequestParam("name") String name, @RequestParam("number") String number){
        Contact savedContact = contactsService.save(name, number);
        return new ResponseEntity<>(savedContact, HttpStatus.OK);
    }

    @PatchMapping()
    @ResponseBody
    public ResponseEntity<String> addSuffixToNames(@RequestParam("suffix") String suffix){
        contactsService.addSuffixToNames(suffix);
        return new ResponseEntity<>("Suffix added", HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    @ResponseBody
    public ResponseEntity<Contact> editContact(@PathVariable int id, @RequestParam("name") String name,
                                               @RequestParam("number") String number){

        contactsService.update(id, name, number);
        return new ResponseEntity<>(contactsService.getById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteContact(@PathVariable("id") int id){
        contactsService.delete(id);
        return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
    }

/*    @GetMapping("/{id}")
    @ResponseBody
    public Contact contactInfo(@PathVariable int id){
        return contactsService.getById(id);
    }*/

}
