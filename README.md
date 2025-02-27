# <font color="blue">Mock GraphQL API for Kotlin Developers</font>

This README provides instructions for setting up and using a GraphQL server that
mocks a typical backend API for technical interviews. This server is particularly
designed for testing Kotlin developers' understanding of GraphQL integration.

## <font color="blue">INTERVIEW TASK</font>

- Access the full task description [**here**](TASK.md).

## Introduction

This mock server provides a GraphQL API that simulates a real-world application backend. It's built using Apollo Server and Express, offering a playground interface for easy query testing and development.

## Prerequisites

- **Node.js**: You need Node.js installed on your computer. Download and install it from [nodejs.org](https://nodejs.org/).

  - For Windows/Mac: Download the installer from the website
  - For Linux: Use package manager (e.g., `sudo apt install nodejs npm` for Ubuntu/Debian)

- **Git**: Required to clone this repository. Download from [git-scm.com](https://git-scm.com/downloads)

## Getting Started

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd graphql
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Server

```bash
npm start
```

The server will start on port 4200. You can access the GraphQL playground at `http://localhost:4200/graphql`

## Available Operations

### Available Queries and Mutations

```graphql
# Login Mutation
mutation Login {
  login(
    input: { email: "instructor@example.com", password: "hashedpassword123" }
  ) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}

# Get all organizations
query GetOrganizations {
  organizations {
    id
    name
    accountType
    country {
      name
      code
    }
  }
}

# Get a specific school with related data
query GetSchool {
  school(id: "1") {
    id
    name
    createdAt
    organization {
      name
    }
    county {
      name
    }
    camps {
      id
      name
      curriculum
    }
  }
}

# Get camps with students
query GetCampsWithStudents {
  camps {
    id
    name
    startDate
    endDate
    curriculum
    school {
      name
    }
    students {
      id
      firstName
      lastName
      gender
      age
      grade
    }
    campGroups {
      id
      name
    }
  }
}

# Get students by camp
query GetStudentsByCamp {
  studentsByCamp(campId: "1") {
    id
    firstName
    lastName
    age
    grade
    gender
  }
}

# Create a new student
mutation CreateStudent {
  createStudent(
    input: {
      firstName: "New"
      lastName: "Student"
      middleName: ""
      age: 11
      grade: 6
      gender: MALE
      availableForLearningCamp: true
      campId: "1"
    }
  ) {
    id
    firstName
    lastName
    gender
    age
    camp {
      name
    }
  }
}

# Update a student
mutation UpdateStudent {
  updateStudent(
    id: "1"
    input: { firstName: "Updated", lastName: "Student", age: 12 }
  ) {
    id
    firstName
    lastName
    age
  }
}

# Create a new school
mutation CreateSchool {
  createSchool(
    input: { countyId: "1", name: "GraphQL Test School", organizationId: "1" }
  ) {
    id
    name
    createdAt
  }
}

# Create a new camp
mutation CreateCamp {
  createCamp(
    input: {
      name: "GraphQL Summer Camp"
      startDate: "2024-06-01"
      endDate: "2024-06-30"
      curriculum: LITERACY
      organizationId: "1"
      schoolId: "1"
    }
  ) {
    id
    name
    startDate
    endDate
  }
}

# Create a new camp group
mutation CreateCampGroup {
  createCampGroup(
    input: { name: "GraphQL Group", campId: "1", students: ["1"] }
  ) {
    id
    name
    students {
      firstName
      lastName
    }
  }
}
```

## Data Model

The API follows this basic data model:

- Organizations have many Schools
- Schools have many Camps
- Camps have many Students and CampGroups
- Students belong to a Camp and optionally to a CampGroup
- Countries have many Counties
- Schools belong to Counties

## Testing in Kotlin

Here's a basic example of how to integrate with this API using Kotlin and Apollo Android:

```kotlin
// Define your Apollo Client
val apolloClient = ApolloClient.builder()
    .serverUrl("http://localhost:4200/graphql")
    .build()

// Execute a query
lifecycleScope.launch {
    try {
        val response = apolloClient.query(LoginMutation(
            LoginInput(
                email = "instructor@example.com",
                password = "hashedpassword123"
            )
        )).execute()

        response.data?.login?.let { loginData ->
            // Handle successful login
            val token = loginData.token
            val user = loginData.user
        }
    } catch (e: ApolloException) {
        // Handle error
    }
}
```

## Error Handling

The API returns standard GraphQL errors with the following structure:

```json
{
  "errors": [
    {
      "message": "Error message",
      "locations": [
        {
          "line": 1,
          "column": 1
        }
      ],
      "path": ["fieldName"],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

Common error codes include:

- INTERNAL_SERVER_ERROR
- INVALID_CREDENTIALS
- NOT_FOUND
- VALIDATION_ERROR

## Development Notes

- The server uses a local `db.json` file as its data store
- Authentication is implemented but simplified for interview purposes
- The GraphQL playground is enabled for easy testing
- All mutations require proper input types as defined in the schema
