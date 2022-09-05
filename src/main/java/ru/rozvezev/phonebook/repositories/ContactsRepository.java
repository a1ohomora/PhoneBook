package ru.rozvezev.phonebook.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.rozvezev.phonebook.models.Contact;

@Repository
public interface ContactsRepository extends JpaRepository<Contact, Integer> {

    @Modifying
    @Query("update Contact c set c.name = :name, c.phoneNumber = :phoneNumber, c.updatedAt=current_timestamp where c.id = :id")
    void updateNameAndNumber(@Param("id") int id, @Param("name") String name, @Param("phoneNumber") String phoneNumber);


    @Modifying
    @Query("update Contact c set c.name = concat(c.name, :suffix)")
    void addSuffixToNames(@Param("suffix") String suffix);

}
