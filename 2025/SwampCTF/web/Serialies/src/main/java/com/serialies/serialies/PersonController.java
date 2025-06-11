package com.serialies.serialies;

import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/person")
public class PersonController {

    private List<Person> persons = new ArrayList<>();

    @PostMapping
    public String createPerson(@RequestBody Person person) {
        if (person.getAddress() == null) {
            throw new IllegalArgumentException("Address is required");
        }
        if (person.getJob() != null) {
            try {
                person.getJob().init();
            } catch (IOException e) {
                throw new RuntimeException("Error", e);
            }
        }
        persons.add(person);
        return "Person has been created with ID: " + person.getId();
    }

    @GetMapping
    public List<Person> getAllPersons() {
        return persons;
    }

    @GetMapping("/{id}")
    public Person getPersonById(@PathVariable UUID id) {
        Optional<Person> person = persons.stream().filter(p -> p.getId().equals(id)).findFirst();
        if (person.isPresent()) {
            return person.get();
        } else {
            throw new RuntimeException("Person not found with ID: " + id);
        }
    }
}