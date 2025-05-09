package com.eventlite.authservice.repository; // Correct package

import com.eventlite.authservice.entity.User; // Import the User entity
import org.springframework.data.jpa.repository.JpaRepository; // Import Spring Data JPA base repository
import org.springframework.stereotype.Repository; // Mark as a Spring component (optional but good practice)

import java.util.Optional; // Use Optional for methods that might not find a result

@Repository // Indicates this is a Spring Data repository bean
public interface UserRepository extends JpaRepository<User, Integer> {
    // JpaRepository<EntityType, IdType> -> User is the entity, Integer is the type of its ID (@Id field)

    // --- Spring Data JPA Derived Query Methods ---
    // Spring Data automatically implements this method based on its name!
    // It translates "findByEmail" into a "SELECT u FROM User u WHERE u.email = :email" query.
    Optional<User> findByEmail(String email);

    //  Automatically get methods like:
    // - save(User entity) -> Saves or updates a user, returns the saved user
    // - findById(Integer id) -> Returns Optional<User>
    // - existsById(Integer id) -> Returns boolean
    // - findAll() -> Returns List<User>
    // - deleteById(Integer id) -> Deletes user
    // - count() -> Returns long
    // ...and many more!

    // I can also add custom derived queries here if needed, e.g.:
    // Optional<User> findByNameIgnoreCase(String name);
    // boolean existsByEmail(String email);
}