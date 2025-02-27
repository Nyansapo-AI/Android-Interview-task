# Kotlin Developer Interview Task

## Overview

> Welcome to the technical assessment for the Junior Kotlin Developer position. This task is designed to evaluate your Kotlin programming skills, understanding of Android development principles, and ability to work with APIs.

> You will be building a simple Android application that interacts with a provided mock API server. The application will allow users to manage educational camps, schools, and students within an educational organization.

## Time Constraint

You have **5 days** to complete this task from the time you receive it. Please manage your time effectively and focus on delivering a functional application that meets the core requirements.

## Prerequisites

- Android Studio (latest stable version)
- Kotlin programming language knowledge
- Basic understanding of MVVM architecture
- Familiarity with GraphQL APIs
- Git for version control

## Mock API Server

A mock GraphQL server has been provided to simulate the backend API. The server contains data related to educational organizations, schools, camps, and students. Detailed instructions for setting up and running the mock server are available in the `README.md` file **[here](README.md)**.

The mock server provides endpoints for:

- Authentication (login)
- Organizations
- Schools
- Camps
- Students
- Camp Groups

## Task Requirements

### Core Features

1. **Authentication**

   - Implement a login screen that authenticates users against the mock API
   - Handle authentication errors appropriately
   - Store and manage the authentication token for subsequent API requests

2. **Dashboard**

   - After login, display a dashboard showing summary information:
     - Number of schools
     - Number of camps
     - Number of students

3. **Schools Management**

   - Display a list of schools with basic information
   - Allow viewing detailed information for each school
   - Implement functionality to add a new school

4. **Camps Management**

   - Display a list of learning camps
   - Allow viewing detailed information for each camp including assigned students
   - Implement functionality to create a new camp

5. **Students Management**
   - Display a list of students
   - Allow viewing detailed student information
   - Implement functionality to add a new student and assign to a camp

### Technical Requirements

1. **Architecture**

   - Use MVVM (Model-View-ViewModel) architecture
   - Implement clean separation of concerns
   - Use Kotlin coroutines for asynchronous operations

2. **UI/UX**

   - Create a clean, intuitive user interface
   - Implement proper navigation between screens
   - Handle loading states and error scenarios appropriately
   - Support both portrait and landscape orientations

3. **API Integration**

   - Use Retrofit or similar library for API communication
   - Implement proper error handling for API calls
   - Cache data where appropriate for improved performance

4. **Data Persistence**

   - Store authentication token securely
   - Implement basic offline capability (view previously loaded data)

5. **Testing**
   - Write unit tests for ViewModels
   - Write UI tests for at least one key feature
   - Ensure test coverage for critical functionality

## Submission Guidelines

1. Create a GitHub repository for your project
2. Commit your code regularly with clear, descriptive commit messages
3. Include a README.md file with:
   - Setup instructions
   - Features implemented
   - Architecture overview
   - Any libraries or tools used
   - Challenges faced and how you overcame them
   - Any known issues or limitations
4. Ensure your code is well-documented with comments where necessary
5. Submit the GitHub repository URL when complete BY FILLING THIS [FORM](https://forms.office.com/r/qMyTxJuiRv)

## Evaluation Criteria

Your submission will be evaluated based on:

1. **Functionality**: Does the application work as expected and meet the requirements?
2. **Code Quality**: Is the code well-structured, readable, and maintainable?
3. **Architecture**: Is the MVVM architecture properly implemented?
4. **UI/UX**: Is the user interface intuitive and responsive?
5. **Testing**: Are there sufficient tests to ensure code quality?
6. **Documentation**: Is the code and project well-documented?
7. **Problem Solving**: How well did you handle challenges and edge cases?

## Notes

- **Focus on delivering a working solution that meets the core requirements**
- **UI design is provided as a guideline; you may enhance or modify it as needed**
- **Ask questions if anything in the requirements is unclear**. Email: steven@nyansapoai.net
- **Document any assumptions you make during development**

> Good luck! We look forward to seeing your solution.
