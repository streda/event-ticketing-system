/*
    This User.java file now acts as the typed, object-oriented representation of my
    auth_schema.users database table within your Spring Boot application.
*/

package com.eventlite.authservice.entity; // Package declaration based on path

import jakarta.persistence.*; // JPA annotations (using jakarta namespace for Spring Boot 3+)
import lombok.Data; // Lombok annotation for boilerplate code (getters, setters, toString, etc.)
import lombok.NoArgsConstructor; // Lombok annotation for no-args constructor (required by JPA)
import lombok.AllArgsConstructor; // Lombok annotation for all-args constructor (optional, but convenient)
import java.time.LocalDateTime; // Use appropriate Java date/time class
import org.hibernate.annotations.CreationTimestamp; // Hibernate specific for auto-timestamp

@Data // Lombok:  A shortcut that generates standard methods: @Getter, @Setter, @ToString, @EqualsAndHashCode,
        // @RequiredArgsConstructor.
@NoArgsConstructor // Lombok: Generates no-argument constructor. JPA requires entities to have a no-argument constructor
@AllArgsConstructor // Lombok: Generates constructor with all fields as arguments. Often convenient for creating objects,
// especially in tests.
@Entity // JPA: Marks this class as a persistent entity
@Table(schema = "auth_schema", name = "users") // JPA: Maps this class to the specific table and schema
public class User {

    @Id // JPA: Marks this field as the primary key column

    // @GeneratedValue Tells JPA to rely on the database's auto-increment mechanism
    // (like PostgreSQL's SERIAL type or sequences) to generate the ID value upon insertion.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // JPA: Configures auto-increment for the ID (uses the DB sequence)
    private Integer id; // Use Integer or Long. Matches SERIAL -> integer in PG.

    // nullable corresponds to the NOT NULL constraint in the database.
    @Column(nullable = false, unique = true, length = 255) // JPA: Maps to a column, adds constraints
    private String email;

    // I added name, now it is matching the migration
    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "password_hash", nullable = false, length = 255) // Explicitly map column name if different from field name
    private String passwordHash; // Use camelCase for field name in Java

    // @CreationTimestamp: A Hibernate-specific annotation (works with JPA) that automatically populates the field with
    // the current timestamp when the entity is first saved (persisted).
    @CreationTimestamp // Hibernate: Automatically set this field on entity creation

    // updatable = false: Prevents JPA from including this column in SQL UPDATE statements (useful for created_at).
    @Column(name = "created_at", nullable = false, updatable = false) // Map column name, non-nullable, prevent updates
    private LocalDateTime createdAt; // Use LocalDateTime for TIMESTAMP WITHOUT TIME ZONE

    // I should add @UpdateTimestamp for an 'updated_at' field later
    // @UpdateTimestamp
    // @Column(name = "updated_at")
    // private LocalDateTime updatedAt;

    // Lombok generates constructors, getters, setters etc. automatically.
    // So, I don't need to write them manually unless I need custom logic.
}