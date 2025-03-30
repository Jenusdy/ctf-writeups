package com.serialies.serialies;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Job {
    private String title;
    private String company;
    private double salary;
    private String resume; 
    private String resumeURI;

    public void init() throws IOException {
        if (resumeURI != null) {
            URI fileUri = URI.create(resumeURI);
            this.resume = new String(Files.readAllBytes(Paths.get(fileUri)));
        } 
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getResume() {
        return resume;
    }

    public void setResume(String resume) {
        this.resume = resume;
    }

    public String getResumeURI() {
        return resumeURI;
    }

    public void setResumeURI(String resumeURI) {
        this.resumeURI = resumeURI;
    }
}