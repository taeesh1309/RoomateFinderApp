# HookieFinder - A roommate Finding App for the Hokies by the Hokies

This repository contains the source code for the HokieFinder app, designed to help users find compatible roommates using a machine learning-based matching algorithm.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

- **Node.js**, **ios simulator** and **npm** installed

### Setup Instructions

1. **Install dependencies:**

   ```bash
   yarn

   ```

2. **Import expo-cli**

   ```bash
   yarn global add expo-cli

   ```

3. **To install debugger (not required for setup)**

   ```bash
   npm install -g react-devtools

   ```

4. **To start the app**
   ```bash
   npx expo start
   ```
5. **To run in ios mode**
   ```bash
   i
   ```
6. **Run the backend code**
   ```bash
   cd WebFlaskService
   python main.py
   ```




## Unit Tests

Unit tests were implemented using the `pytest` library in Python to ensure the functionality and correctness of the APIs. Below are instructions to run the tests for both the Flask Model API and the Flask Firebase API.

### Testing the Flask Model API

1. Navigate to the backend directory:

   ```bash
   cd WebFlaskService
   ```

2. Run the test cases for the Model API:

   ```bash
   pytest -v test_model_flask_api.py
   ```

3. **Output Example**:

   ```plaintext
   ====================================================================== test session starts =======================================================================
   platform darwin -- Python 3.11.5, pytest-8.3.4, pluggy-1.5.0 -- /Users/taeeshassadi/Desktop/Projects/Software Engineering/RoommateFinderApp/WebFlaskService/venv/bin/python
   cachedir: .pytest_cache
   rootdir: /Users/taeeshassadi/Desktop/Projects/Software Engineering/RoommateFinderApp/WebFlaskService
   plugins: mock-3.14.0, anyio-4.6.2.post1
   collected 3 items                                                                                                                                                

   test_model_flask_api.py::test_find_roommates_success PASSED                                                                                                [ 33%]
   test_model_flask_api.py::test_find_roommates_missing_field PASSED                                                                                          [ 66%]
   test_model_flask_api.py::test_find_roommates_internal_error PASSED                                                                                         [100%]

   ======================================================================== 3 passed, 2 warnings in 1.00s ========================================================================
   ```

4. **Test Details**:
   - The Model API tests verify the retrieval of recommended Roommates when passed with different parameters.
   - All tests pass successfully, ensuring API stability.

### Testing the Flask Firebase API

1. Navigate to the backend directory:

   ```bash
   cd WebFlaskService
   ```

2. Run the test cases for the Firebase API:

   ```bash
   pytest -v test_firebase_flask_api.py
   ```

3. **Output Example**:

   ```plaintext
   ====================================================================== test session starts =======================================================================
   platform darwin -- Python 3.11.5, pytest-8.3.4, pluggy-1.5.0 -- /Users/taeeshassadi/Desktop/Projects/Software Engineering/RoommateFinderApp/WebFlaskService/venv/bin/python
   cachedir: .pytest_cache
   rootdir: /Users/taeeshassadi/Desktop/Projects/Software Engineering/RoommateFinderApp/WebFlaskService
   plugins: mock-3.14.0, anyio-4.6.2.post1
   collected 4 items                                                                                                                                                

   test_firebase_flask_api.py::test_add_user_success PASSED                                                                                                   [ 25%]
   test_firebase_flask_api.py::test_get_user_success PASSED                                                                                                   [ 50%]
   test_firebase_flask_api.py::test_get_user_not_found PASSED                                                                                                 [ 75%]
   test_firebase_flask_api.py::test_add_user_internal_error PASSED                                                                                            [100%]

   ======================================================================== 4 passed in 0.31s ========================================================================
   ```

4. **Test Details**:
   - The Firebase API tests verify the addition and retrieval of users in the Firestore database.
   - All tests pass successfully, ensuring API stability.
