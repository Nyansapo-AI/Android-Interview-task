const jsonServer = require("json-server");
const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");
const express = require("express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const bodyParser = require("body-parser");

// Initialize JSON Server with your data
const jsonServerRouter = jsonServer.router("db.json");
const db = jsonServerRouter.db;

// Define GraphQL schema types
const typeDefs = gql`
  enum Gender {
    MALE
    FEMALE
  }

  enum Curriculum {
    LITERACY
    NUMERACY
  }

  enum AccountType {
    ORGANIZATION
  }

  enum Role {
    INSTRUCTOR
  }

  type User {
    id: ID!
    email: String!
    role: Role!
    firstName: String!
    lastName: String!
    phone: String!
    gender: Gender!
    trained: Boolean!
    organizationId: ID!
    organization: Organization
  }

  type Organization {
    id: ID!
    name: String!
    countryId: ID!
    createdAt: String!
    accountType: AccountType!
    stripeCustomerId: String
    country: Country
    schools: [School]
    camps: [Camp]
  }

  type Country {
    id: ID!
    name: String!
    code: String!
    counties: [County]
  }

  type County {
    id: ID!
    name: String!
    latitude: String!
    longitude: String!
    countryId: ID!
    country: Country
    schools: [School]
  }

  type School {
    id: ID!
    countyId: ID!
    name: String!
    createdAt: String!
    organizationId: ID!
    county: County
    organization: Organization
    camps: [Camp]
  }

  type Camp {
    id: ID!
    name: String!
    startDate: String!
    endDate: String!
    createdAt: String!
    curriculum: Curriculum!
    organizationId: ID!
    schoolId: ID!
    organization: Organization
    school: School
    students: [Student]
    campGroups: [CampGroup]
  }

  type Student {
    id: ID!
    firstName: String!
    middleName: String
    lastName: String!
    age: Int!
    grade: Int!
    gender: Gender!
    createdAt: String!
    availableForLearningCamp: Boolean!
    campId: ID!
    camp: Camp
    campGroup: CampGroup
  }

  type CampGroup {
    id: ID!
    name: String!
    createdAt: String!
    campId: ID!
    students: [Student]
    camp: Camp
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User

    organizations: [Organization]
    organization(id: ID!): Organization

    countries: [Country]
    country(id: ID!): Country

    counties: [County]
    county(id: ID!): County

    schools: [School]
    school(id: ID!): School
    schoolsByOrganization(organizationId: ID!): [School]

    camps: [Camp]
    camp(id: ID!): Camp
    campsBySchool(schoolId: ID!): [Camp]
    campsByOrganization(organizationId: ID!): [Camp]

    students: [Student]
    student(id: ID!): Student
    studentsByCamp(campId: ID!): [Student]

    campGroups: [CampGroup]
    campGroup(id: ID!): CampGroup
    campGroupsByCamp(campId: ID!): [CampGroup]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateSchoolInput {
    countyId: ID!
    name: String!
    organizationId: ID!
  }

  input CreateCampInput {
    name: String!
    startDate: String!
    endDate: String!
    curriculum: Curriculum!
    organizationId: ID!
    schoolId: ID!
  }

  input CreateStudentInput {
    firstName: String!
    middleName: String
    lastName: String!
    age: Int!
    grade: Int!
    gender: Gender!
    availableForLearningCamp: Boolean!
    campId: ID!
  }

  input UpdateStudentInput {
    firstName: String
    middleName: String
    lastName: String
    age: Int
    grade: Int
    gender: Gender
    availableForLearningCamp: Boolean
    campId: ID
  }

  input CreateCampGroupInput {
    name: String!
    campId: ID!
    students: [ID!]
  }

  type Mutation {
    login(input: LoginInput!): AuthPayload

    createSchool(input: CreateSchoolInput!): School

    createCamp(input: CreateCampInput!): Camp
    addStudentsToCamp(campId: ID!, studentIds: [ID!]!): Camp

    createStudent(input: CreateStudentInput!): Student
    updateStudent(id: ID!, input: UpdateStudentInput!): Student
    deleteStudent(id: ID!): Boolean

    createCampGroup(input: CreateCampGroupInput!): CampGroup
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    // User queries
    users: () => db.get("users").value(),
    user: (_, { id }) =>
      db
        .get("users")
        .find({ id: parseInt(id) })
        .value(),

    // Organization queries
    organizations: () => db.get("organizations").value(),
    organization: (_, { id }) =>
      db
        .get("organizations")
        .find({ id: parseInt(id) })
        .value(),

    // Country queries
    countries: () => db.get("countries").value(),
    country: (_, { id }) =>
      db
        .get("countries")
        .find({ id: parseInt(id) })
        .value(),

    // County queries
    counties: () => db.get("counties").value(),
    county: (_, { id }) =>
      db
        .get("counties")
        .find({ id: parseInt(id) })
        .value(),

    // School queries
    schools: () => db.get("schools").value(),
    school: (_, { id }) =>
      db
        .get("schools")
        .find({ id: parseInt(id) })
        .value(),
    schoolsByOrganization: (_, { organizationId }) =>
      db
        .get("schools")
        .filter({ organizationId: parseInt(organizationId) })
        .value(),

    // Camp queries
    camps: () => db.get("camps").value(),
    camp: (_, { id }) =>
      db
        .get("camps")
        .find({ id: parseInt(id) })
        .value(),
    campsBySchool: (_, { schoolId }) =>
      db
        .get("camps")
        .filter({ schoolId: parseInt(schoolId) })
        .value(),
    campsByOrganization: (_, { organizationId }) =>
      db
        .get("camps")
        .filter({ organizationId: parseInt(organizationId) })
        .value(),

    // Student queries
    students: () => db.get("students").value(),
    student: (_, { id }) =>
      db
        .get("students")
        .find({ id: parseInt(id) })
        .value(),
    studentsByCamp: (_, { campId }) =>
      db
        .get("students")
        .filter({ campId: parseInt(campId) })
        .value(),

    // CampGroup queries
    campGroups: () => db.get("campGroups").value(),
    campGroup: (_, { id }) =>
      db
        .get("campGroups")
        .find({ id: parseInt(id) })
        .value(),
    campGroupsByCamp: (_, { campId }) =>
      db
        .get("campGroups")
        .filter({ campId: parseInt(campId) })
        .value(),
  },

  Mutation: {
    login: (_, { input }) => {
      const { email, password } = input;
      const user = db.get("users").find({ email }).value();

      if (user && user.password === password) {
        return {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          user: user,
        };
      } else {
        throw new Error("Invalid credentials");
      }
    },

    createSchool: (_, { input }) => {
      const newId = db.get("schools").value().length + 1;
      const newSchool = {
        ...input,
        id: newId,
        countyId: parseInt(input.countyId),
        organizationId: parseInt(input.organizationId),
        createdAt: new Date().toISOString().split("T")[0],
      };

      db.get("schools").push(newSchool).write();
      return newSchool;
    },

    createCamp: (_, { input }) => {
      const newId = db.get("camps").value().length + 1;
      const newCamp = {
        ...input,
        id: newId,
        organizationId: parseInt(input.organizationId),
        schoolId: parseInt(input.schoolId),
        createdAt: new Date().toISOString().split("T")[0],
      };

      db.get("camps").push(newCamp).write();
      return newCamp;
    },

    addStudentsToCamp: (_, { campId, studentIds }) => {
      const camp = db
        .get("camps")
        .find({ id: parseInt(campId) })
        .value();

      if (!camp) {
        throw new Error("Camp not found");
      }

      // Update each student's campId
      studentIds.forEach((studentId) => {
        db.get("students")
          .find({ id: parseInt(studentId) })
          .assign({ campId: parseInt(campId) })
          .write();
      });

      return db
        .get("camps")
        .find({ id: parseInt(campId) })
        .value();
    },

    createStudent: (_, { input }) => {
      const newId = db.get("students").value().length + 1;
      const newStudent = {
        ...input,
        id: newId,
        campId: parseInt(input.campId),
        createdAt: new Date().toISOString(),
      };

      db.get("students").push(newStudent).write();
      return newStudent;
    },

    updateStudent: (_, { id, input }) => {
      const student = db
        .get("students")
        .find({ id: parseInt(id) })
        .value();

      if (!student) {
        throw new Error("Student not found");
      }

      // Process input values and parse IDs
      if (input.campId) {
        input.campId = parseInt(input.campId);
      }

      db.get("students")
        .find({ id: parseInt(id) })
        .assign(input)
        .write();

      return db
        .get("students")
        .find({ id: parseInt(id) })
        .value();
    },

    deleteStudent: (_, { id }) => {
      const student = db
        .get("students")
        .find({ id: parseInt(id) })
        .value();

      if (!student) {
        throw new Error("Student not found");
      }

      db.get("students")
        .remove({ id: parseInt(id) })
        .write();
      return true;
    },

    createCampGroup: (_, { input }) => {
      const newId = db.get("campGroups").value().length + 1;

      // Convert string IDs to integers
      const studentIds = input.students.map((id) => parseInt(id));

      const newCampGroup = {
        id: newId,
        name: input.name,
        campId: parseInt(input.campId),
        createdAt: new Date().toISOString().split("T")[0],
        students: studentIds,
      };

      db.get("campGroups").push(newCampGroup).write();
      return newCampGroup;
    },
  },

  // Resolver field for related data
  User: {
    organization: (user) =>
      db.get("organizations").find({ id: user.organizationId }).value(),
  },

  Organization: {
    country: (org) => db.get("countries").find({ id: org.countryId }).value(),
    schools: (org) =>
      db.get("schools").filter({ organizationId: org.id }).value(),
    camps: (org) => db.get("camps").filter({ organizationId: org.id }).value(),
  },

  Country: {
    counties: (country) =>
      db.get("counties").filter({ countryId: country.id }).value(),
  },

  County: {
    country: (county) =>
      db.get("countries").find({ id: county.countryId }).value(),
    schools: (county) =>
      db.get("schools").filter({ countyId: county.id }).value(),
  },

  School: {
    county: (school) =>
      db.get("counties").find({ id: school.countyId }).value(),
    organization: (school) =>
      db.get("organizations").find({ id: school.organizationId }).value(),
    camps: (school) => db.get("camps").filter({ schoolId: school.id }).value(),
  },

  Camp: {
    organization: (camp) =>
      db.get("organizations").find({ id: camp.organizationId }).value(),
    school: (camp) => db.get("schools").find({ id: camp.schoolId }).value(),
    students: (camp) => db.get("students").filter({ campId: camp.id }).value(),
    campGroups: (camp) =>
      db.get("campGroups").filter({ campId: camp.id }).value(),
  },

  Student: {
    camp: (student) => db.get("camps").find({ id: student.campId }).value(),
    campGroup: (student) => {
      const campGroups = db.get("campGroups").value();
      return campGroups.find(
        (group) => group.students && group.students.includes(student.id)
      );
    },
  },

  CampGroup: {
    camp: (campGroup) => db.get("camps").find({ id: campGroup.campId }).value(),
    students: (campGroup) => {
      if (!campGroup.students) return [];
      return campGroup.students
        .map((id) => db.get("students").find({ id }).value())
        .filter(Boolean);
    },
  },
};

// Create a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Express server
const app = express();
app.use(bodyParser.json());

// Set up Apollo Server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // authentication logic here if needed
    return { db };
  },
  playground: true, // Enable GraphQL playground
  introspection: true, // Enable introspection
});

// Apply Apollo middleware to Express
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  // This middleware can be used for any REST-specific endpoints you want to keep
  app.use("/api", jsonServerRouter);

  // Start server
  const PORT = 4200;
  app.listen(PORT, () => {
    console.log(
      `\x1b[32m\x1b[1m\u{1F680} GraphQL server running at http://localhost:${PORT}${server.graphqlPath}\x1b[0m`
    );
    // console.log(`REST API available at http://localhost:${PORT}/api`);
  });
}

startServer();
