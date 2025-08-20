# MongoDB Aggregation Pipeline: A Comprehensive Guide

This guide introduces the **MongoDB Aggregation Pipeline**, a powerful feature for advanced data processing and analysis within MongoDB. It aims to make you proficient in using aggregation pipelines through practical, scenario-based examples.

## Target Audience & Prerequisites

This tutorial is **not for absolute beginners** in MongoDB. It's intended for those who:

- Understand **basic MongoDB concepts**, such as connecting to a database and handling **connection strings** from MongoDB Atlas.
- Are familiar with **CRUD (Create, Read, Update, Delete) operations**, like `updateMany` or `updateOne`.
- Want to **advance their MongoDB skills** by leveraging aggregation pipelines for complex data analysis.

## Setup and Data Import

The tutorial uses **MongoDB Atlas** (free tier) and **VS Code with the MongoDB extension** for setting up the environment.

### MongoDB Atlas Setup

1.  **Create a free account** on MongoDB Atlas.
2.  **Ensure proper network access** (e.g., allow access from anywhere or your local IP) and **database user credentials** are configured.
3.  **Obtain the connection string** from your MongoDB Atlas cluster.
4.  **Create a new database** named "agree" and three initial collections: "users", "authors", and "books".

### VS Code Setup

1.  **Install VS Code**.
2.  Install the **MongoDB for VS Code extension**.
3.  **Connect VS Code to MongoDB Atlas** using your connection string (remember to replace placeholders like `<password>` with your actual password).
4.  **Verify the connection** in the MongoDB extension sidebar to see your "agree" database and its collections.

### Data Import

The tutorial uses pre-prepared JSON data from [Hitesh's GitHub Gist](https://www.google.com/search?q=https://gist.github.com/Hiteshchoudhary). You will find `author JSON`, `books JSON`, and `data JSON` (for the "users" collection).

1.  **Copy the raw content** of `author JSON`.
2.  In VS Code, **right-click on the "authors" collection** under your "agree" database and select "Insert Document".
3.  Modify the generated script: change `insertOne` to `insertMany` and **paste the copied JSON array** inside the `insertMany` function.
4.  **Run the script** by clicking the play button to import the data.
5.  Repeat steps 1-4 for `books JSON` into the "books" collection and `data JSON` into the "users" collection.

-----

## Understanding the Data Structure (Users Collection)

The "users" collection contains fictitious data designed for practical aggregation examples. Key fields include:

  * `name`
  * `isActive` (boolean: `true`/`false`)
  * `registered` (date of registration)
  * `age`
  * `gender`
  * `eyeColor`
  * `favoriteFruit`
  * `company` (an object with nested fields like `location` and `phone`)
  * `location` (nested under `company`, contains `country`)
  * `tags` (an array of strings)

This dataset simulates real-world scenarios, making it ideal for practicing data analysis for dashboards or admin panels.

-----

## Introduction to the Aggregation Pipeline 📈

The aggregation pipeline in MongoDB consists of **one or more stages**. Each stage processes documents and passes the results to the next stage, allowing for complex data transformations and analyses.

**Structure:** Aggregation queries are written as an **array of objects**. Each object represents a **stage**.

```javascript
db.collection.aggregate([
  { /* Stage 1: e.g., $match */ },
  { /* Stage 2: e.g., $group */ },
  // ... more stages
])
```

The output of one stage becomes the input for the next. This chained processing is what makes the aggregation pipeline powerful. The tutorial focuses on writing these queries in the text format within MongoDB Atlas for better understanding.

-----

## Key Aggregation Stages and Their Meanings 🛠️

Here's a breakdown of the primary aggregation stages covered, along with their purpose:

  * ### `$match` Stage

    **Meaning:** Filters documents to pass only those that match the specified `query` to the next pipeline stage. It acts like a query filter in `find()` but within an aggregation pipeline.
    **Example Use:** Selecting active users, users with a specific tag, or users from a certain country.

  * ### `$group` Stage

    **Meaning:** Separates documents into groups based on a specified `_id` expression. For each distinct `_id`, it outputs a new document, which can contain accumulated results from the input documents for that group.
    **Example Use:** Counting users by gender, calculating the average age for all users, or categorizing users by favorite fruit.

  * ### `$count` Stage

    **Meaning:** Returns a count of the number of documents passed to it from the previous stage. It's a simple, single-stage pipeline that can be used at any point to get a count.
    **Example Use:** Counting active users or users matching specific criteria.

  * ### `$sort` Stage

    **Meaning:** Reorders the documents by a specified field or fields. The sort order can be ascending (`1`) or descending (`-1`).
    **Example Use:** Finding the most recently registered users or the top-selling products.

  * ### `$limit` Stage

    **Meaning:** Passes the first `n` documents from its input to the next pipeline stage.
    **Example Use:** Getting the "top" N results after sorting, like the top 5 common fruits.

  * ### `$unwind` Stage

    **Meaning:** Deconstructs an array field from the input documents to output a document for each element. If an input document contains an array field, for each element in the array, `$unwind` outputs a new document, duplicating all other fields from the input document.
    **Example Use:** Calculating the average number of tags per user by treating each tag as a separate document entry.

  * ### `$addFields` Stage

    **Meaning:** Adds new fields to documents. It can compute new fields or modify existing ones.
    **Example Use:** Calculating the size of an array and storing it in a new field, or transforming a nested array into a direct object.

  * ### `$project` Stage

    **Meaning:** Reshapes each document in the stream by including, excluding, or resetting the values of existing fields or by adding new fields. It allows you to select specific fields to pass to the next stage.
    **Example Use:** Only returning `name` and `age` fields, or excluding the `_id` field.

  * ### `$lookup` Stage

    **Meaning:** Performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing. It matches documents from the input collection with documents from the "from" collection based on specified fields.
    **Example Use:** Joining books with author details from a separate `authors` collection.

-----

## Key Aggregation Operators and Their Meanings 🧮

These operators are used within aggregation stages (especially `$group` and `$addFields`) to perform calculations and data manipulations:

  * ### Accumulator Operators (used within `$group`):

    These operators perform calculations across the documents within each group, returning a single value per group.

      * #### `$sum`

        **Meaning:** Calculates the sum of numerical values. When used as `{ $sum: 1 }`, it increments a counter by 1 for each document in the group, effectively counting the documents.
        **Example Use:** Counting total males/females, or total users per country.

      * #### `$avg`

        **Meaning:** Calculates the average of numerical values. Non-numerical values are ignored.
        **Example Use:** Finding the average age of users or average number of tags.

      * #### `$push`

        **Meaning:** Appends a specified value to an array. Used within `$group`, it builds an array of all values from the input documents for a field.
        **Example Use:** Listing all user names within a specific fruit category.

      * #### `$first`

        **Meaning:** Returns the value of the first document in a group. When used with a `$lookup` result (which is always an array), it extracts the first element from that array.
        **Example Use:** Flattening the `author_details` array from `$lookup` into a single object.

  * ### Expression Operators (used in various stages like `$match`, `$project`, `$addFields`):

      * #### `$size`

        **Meaning:** Returns the number of elements in an array.
        **Example Use:** Counting the number of tags a user has.

      * #### `$ifNull`

        **Meaning:** Evaluates an expression and, if the expression is `null` or undefined, returns the specified replacement value. Otherwise, it returns the value of the expression.
        **Example Use:** Handling cases where an array field might be missing or `null` by treating it as an empty array before calculating its size.

      * #### `$regex`

        **Meaning:** Provides regular expression capabilities for pattern matching strings.
        **Example Use:** Finding phone numbers that start with a specific sequence.

      * #### `$all`

        **Meaning:** Selects documents where the value of a field is an array that contains *all* the specified elements. The order of elements does not matter.
        **Example Use:** Finding users who have *both* "enim" and "id" as tags.

      * #### `$arrayElemAt`

        **Meaning:** Returns the element at a specified valid index in an array. Supports positive and negative index values.
        **Example Use:** Accessing a specific tag at a certain position (e.g., the second tag) or extracting the first element from an array, similar to `$first`.

-----

## Answering Key Questions with Aggregation (Detailed Examples)

Let's revisit the practical examples with these definitions in mind.

### 1\. How Many Users Are Active?

```javascript
[
  { $match: { isActive: true } }, // Filters documents where 'isActive' is true
  { $count: "activeUsers" }      // Counts the filtered documents and names the result field "activeUsers"
]
```

### 2\. What is the Average Age of All Users?

```javascript
[
  {
    $group: {
      _id: null,              // Groups ALL documents into a single group (indicated by 'null')
      averageAge: { $avg: "$age" } // Calculates the average of the 'age' field for this single group
    }
  }
]
```

### 3\. List the Top Five Most Common Favorite Fruits Among Users

```javascript
[
  {
    $group: {
      _id: "$favoriteFruit", // Groups documents by each unique 'favoriteFruit' value
      count: { $sum: 1 }      // Counts how many documents fall into each fruit group
    }
  },
  { $sort: { count: -1 } }, // Sorts the fruit groups by their 'count' in descending order
  { $limit: 5 }             // Returns only the top 5 fruit groups
]
```

### 4\. Find the Total Number of Males and Females

```javascript
[
  {
    $group: {
      _id: "$gender",    // Groups documents by each unique 'gender' value
      count: { $sum: 1 } // Counts how many documents (users) are in each gender group
    }
  }
]
```

### 5\. Which Country Has the Highest Number of Registered Users?

```javascript
[
  {
    $group: {
      _id: "$company.location.country", // Groups documents by the nested 'country' field
      userCount: { $sum: 1 }            // Counts users within each country group
    }
  },
  { $sort: { userCount: -1 } }, // Sorts countries by their 'userCount' in descending order
  { $limit: 1 }                 // Returns only the country with the highest count
]
```

### 6\. List All the Unique Eye Colors Present in the Collection

```javascript
[
  {
    $group: {
      _id: "$eyeColor" // Groups documents by each unique 'eyeColor' value (result _id's are the unique colors)
    }
  }
]
```

### 7\. What is the Average Number of Tags Per User?

#### Approach 1: Using `$unwind`

```javascript
[
  { $unwind: "$tags" }, // Creates a separate document for each element in the 'tags' array
  {
    $group: {
      _id: "$_id",             // Re-groups documents by their original user ID
      numberOfTags: { $sum: 1 } // Counts how many tags (documents) each original user had
    }
  },
  {
    $group: {
      _id: null,                     // Groups all user-tag-count documents into one
      averageNumberOfTags: { $avg: "$numberOfTags" } // Calculates the average of 'numberOfTags' across all users
    }
  }
]
```

#### Approach 2: Using `$addFields` with `$size` and `$ifNull`

```javascript
[
  {
    $addFields: {
      numberOfTags: {
        $size: { $ifNull: [ "$tags", [] ] } // Adds 'numberOfTags' field: size of 'tags' array (defaulting to 0 if null/missing)
      }
    }
  },
  {
    $group: {
      _id: null,                      // Groups all documents into one
      averageNumberOfTags: { $avg: "$numberOfTags" } // Calculates the average of the new 'numberOfTags' field
    }
  }
]
```

### 8\. How Many Users Have "enim" as One of Their Tags?

```javascript
[
  { $match: { tags: "enim" } }, // Filters documents where the 'tags' array contains "enim"
  { $count: "usersWithEnimTag" } // Counts the filtered documents
]
```

### 9\. What are the Names and Age of Users Who are Inactive AND Have "velit" as a Tag?

```javascript
[
  {
    $match: {
      isActive: false,  // Filters for inactive users
      tags: "velit"     // Filters for users whose 'tags' array contains "velit"
    }
  },
  {
    $project: {
      _id: 0,   // Excludes the default _id field
      name: 1,  // Includes the 'name' field
      age: 1    // Includes the 'age' field
    }
  }
]
```

### 10\. How Many Users Have Phone Numbers Starting with "1940"?

```javascript
[
  {
    $match: {
      "company.phone": /^(\+1\s940)/ // Filters documents where 'company.phone' matches the regex
    }
  },
  { $count: "usersWithSpecialPhoneNumber" } // Counts the filtered documents
]
```

### 11\. Who Has Registered Most Recently?

```javascript
[
  { $sort: { registered: -1 } }, // Sorts documents by 'registered' date in descending order (most recent first)
  { $limit: 4 },                 // Limits the output to the top 4 documents
  {
    $project: {
      _id: 0,             // Excludes _id
      name: 1,            // Includes 'name'
      registered: 1,      // Includes 'registered'
      favoriteFruit: 1    // Includes 'favoriteFruit'
    }
  }
]
```

### 12\. Categorize Users by Their Favorite Fruit

```javascript
[
  {
    $group: {
      _id: "$favoriteFruit", // Groups documents by unique 'favoriteFruit' values
      users: { $push: "$name" } // Creates an array 'users' in each group and adds 'name' to it
    }
  }
]
```

### 13\. How Many Users Have "ad" as Their Second Tag in Their List of Tags?

```javascript
[
  { $match: { "tags.1": "ad" } }, // Filters for documents where the element at index 1 of 'tags' array is "ad"
  { $count: "usersWithSecondTagAd" } // Counts the filtered documents
]
```

### 14\. Find Users Who Have Both "enim" and "id" as Their Tags

```javascript
[
  { $match: { tags: { $all: ["enim", "id"] } } } // Filters documents where the 'tags' array contains BOTH "enim" AND "id"
]
```

### 15\. List All the Companies Located in the USA with Their Corresponding User Count

```javascript
[
  { $match: { "company.location.country": "USA" } }, // Filters for users from companies located in "USA"
  {
    $group: {
      _id: "$company.title", // Groups the filtered users by their 'company.title'
      userCount: { $sum: 1 } // Counts users within each company group
    }
  }
]
```

### 16\. Joining Collections with `$lookup` (Left Outer Join)

This stage performs a left outer join, combining documents from two collections.

**Scenario:** Enriching `book` documents with `author` details by joining `books` and `authors` collections.

**Initial `$lookup` Pipeline (on `books` collection):**

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: "authors",           // Join from the 'authors' collection
      localField: "author_id",   // Field in the current 'books' collection
      foreignField: "_id",       // Field in the 'authors' collection to match 'localField'
      as: "author_details"       // New array field to add to book documents, containing matched authors
    }
  }
])
```

**Result of initial `$lookup` (Example):**
The `author_details` field will be an **array**, even if only one author matches.

```json
{
  "_id": ObjectId("..."),
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "classic",
  "author_details": [ // This is an array
    { "_id": 100, "name": "F. Scott Fitzgerald", "birth_year": 1896 }
  ]
}
```

### Refining `$lookup` Output with `$addFields`

To "flatten" the `author_details` array into a direct object, use `$addFields`:

#### Approach 1: Using `$first`

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: { $first: "$author_details" } // Replaces the array with its first element
    }
  }
])
```

#### Approach 2: Using `$arrayElemAt`

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: { $arrayElemAt: ["$author_details", 0] } // Gets the element at index 0
    }
  }
])
```

#### Final Refined Output (Example):
```javascript
{
  "_id": ObjectId("..."),
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "classic",
  "author_details": { // Now 'author_details' is an object
    "_id": 100,
    "name": "F. Scott Fitzgerald",
    "birth_year": 1896
  }
}
```
#### My mongodb queries
```javascript
Database(Bson)
db={
  "users": [
    {
      _id: 1,
      name: "Prem Ladani",
      email: "premladani@example.com",
      phone: "+91-8849412298",
      gender: "male",
      role: "cloud engineer",
      age: 20,
      country: "India",
      tags: [
        "cloud",
        "AWS",
        "DevOps"
      ]
    },
    {
      _id: 2,
      name: "Aarohi Patel",
      email: "aarohi.patel@example.com",
      phone: "+1-9876543210",
      gender: "female",
      role: "software developer",
      age: 21,
      country: "United States",
      tags: [
        "frontend",
        "React",
        "JavaScript"
      ]
    },
    {
      _id: 3,
      name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      phone: "+44-9123456780",
      gender: "male",
      role: "data analyst",
      age: 22,
      country: "United Kingdom",
      tags: [
        "SQL",
        "Python",
        "Tableau"
      ]
    },
    {
      _id: 4,
      name: "Kavya Shah",
      email: "kavya.shah@example.com",
      phone: "+61-9988776655",
      gender: "female",
      role: "data analyst",
      age: 23,
      country: "Australia",
      tags: [
        "PowerBI",
        "Excel",
        "Data Visualization"
      ]
    },
    {
      "_id": 5,
      "name": "Prem Patel",
      "email": "premladani123@example.com",
      "phone": "+91-8849412299",
      "gender": "male",
      "role": "cloud engineer",
      "age": 20,
      "country": "India",
      "tags": [
        "Azure",
        "Kubernetes",
        "Cloud Security"
      ]
    },
    {
      "_id": 6,
      "name": "Aarohi Jivani",
      "email": "aarohi.patel123@example.com",
      "phone": "+81-9876543210",
      "gender": "female",
      "role": "software developer",
      "age": 21,
      "country": "Japan",
      "tags": [
        "Java",
        "Spring Boot",
        "Backend"
      ]
    },
    {
      "_id": 7,
      "name": "Rohan Mehra",
      "email": "rohan.mehta123@example.com",
      "phone": "+49-9123456780",
      "gender": "male",
      "role": "data analyst",
      "age": 22,
      "country": "Germany",
      "tags": [
        "R",
        "Machine Learning",
        "Statistics"
      ]
    },
    {
      "_id": 8,
      "name": "Kavya Dave",
      "email": "kavya.shah123@example.com",
      "phone": "+33-9988776655",
      "gender": "female",
      "role": "data analyst",
      "age": 23,
      "country": "France",
      "tags": [
        "Python",
        "Pandas",
        "Data Cleaning"
      ]
    },
    {
      "_id": 9,
      "name": "Kavya Vachani",
      "email": "kavya.shah1234@example.com",
      "phone": "+971-9988776655",
      "gender": "female",
      "role": "data analyst",
      "age": 23,
      "country": "United Arab Emirates",
      "tags": [
        "SQL",
        "ETL",
        "Data Warehousing"
      ]
    },
    {
      "_id": 10,
      "name": "Kavya Ramiya",
      "email": "kavya.shah12345@example.com",
      "phone": "+55-9988776655",
      "gender": "female",
      "role": "data analyst",
      "age": 23,
      "country": "Brazil",
      "tags": [
        "Python",
        "AI",
        "Deep Learning"
      ]
    }
  ]
}
```
#### Query :- 
```javascript
db.users.aggregate([
  {
    $unwind: "$tags"
  },
  {
    $group: {
      _id: {
        phone: "$phone",
        tag: "$tags",
        averageNumberOfTags: {
          $avg: "$numberOfTags"
        },
        numberOfTags: {
          $sum: 1
        }
      },
      usercount: {
        $sum: 1
      },
      averageAge: {
        $avg: "$age"
      }
    }
  },
  {
    $sort: {
      usercount: -1
    }
  },
  {
    $limit: 10
  },
  {
    "$lookup": {
      "from": "projects",
      "localField": "_id",
      "foreignField": "userId",
      "as": "user_projects"
    }
  },
  {
    "$addFields": {
      role: {
        "$arrayElemAt": [
          "$role",
          0
        ]
      }
    }
  }
])
```
#### Results :- 
```javascript
[
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+971-9988776655",
      "tag": "SQL"
    },
    "averageAge": 23,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+49-9123456780",
      "tag": "R"
    },
    "averageAge": 22,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+61-9988776655",
      "tag": "PowerBI"
    },
    "averageAge": 23,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+55-9988776655",
      "tag": "Python"
    },
    "averageAge": 23,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+91-8849412299",
      "tag": "Cloud Security"
    },
    "averageAge": 20,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+91-8849412299",
      "tag": "Kubernetes"
    },
    "averageAge": 20,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+81-9876543210",
      "tag": "Java"
    },
    "averageAge": 21,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+91-8849412298",
      "tag": "AWS"
    },
    "averageAge": 20,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+1-9876543210",
      "tag": "frontend"
    },
    "averageAge": 21,
    "role": null,
    "user_projects": [],
    "usercount": 1
  },
  {
    "_id": {
      "averageNumberOfTags": null,
      "numberOfTags": 1,
      "phone": "+44-9123456780",
      "tag": "Tableau"
    },
    "averageAge": 22,
    "role": null,
    "user_projects": [],
    "usercount": 1
  }
]
```
#### Conclusion & Further Learning 💡

#### This tutorial provided a hands-on journey through MongoDB's Aggregation Pipeline, covering essential stages and operators. You now have a solid foundation for performing powerful data analysis.

#### Remember, the best way to truly master aggregation is through continued practice. Explore the [official MongoDB documentation](https://www.mongodb.com/docs/manual/aggregation/) for an exhaustive list of all stages, operators, and their nuances. Experiment with your own datasets and try to answer complex questions about your data\! 