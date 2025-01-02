# HokieFinder - A roommate Finding App for the Hokies by the Hokies

This repository contains the source code for the HokieFinder app, designed to help users find compatible roommates using a machine learning-based matching algorithm.

## Getting Started

Follow these instructions to set up the project on your local machine.

### Prerequisites

- **Node.js**, **ios simulator** and **npm** installed.
- One must also add the serviceAccountKey.json file from their Firebase account by generating a new private key inside the WebFlaskService folder.

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




## Unit Tests for HokieFinder

Unit tests were implemented using the `pytest` library in Python to ensure the functionality and correctness of the APIs. Below are instructions to run the tests for both the Flask Model API and the Flask Firebase API.

### 1. Testing the Flask Model API

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

### 2. Testing the Flask Firebase API

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


## Acceptance Tests for HokieFinder

This section outlines the acceptance tests designed to validate that the HokieFinder application meets the user stories and functionality. The provided use cases include execution steps and expected outputs. These instructions can be followed to verify the correctness and completeness of the application functionality.

---

### Use Case 1: Profile Form Input Validation

#### User Story
As a user, I want the profile form to validate inputs so I can avoid submitting incorrect data. This will save me time and ensure that only accurate and complete information is stored in my profile.

#### Execution Steps
1. Navigate to the "Create Profile" page in the app.
2. Enter invalid data into the following fields:
   - **Email**: Enter an incorrect format (e.g., `invalidemail`).
   - **Phone Number**: Enter letters or an incomplete number (e.g., `abcd123`).
   - **Age** or **Budget**: Enter a non-numeric value (e.g., `twenty`).
3. Attempt to submit the form.

#### Expected Output
- For invalid email input, an error message should display: "Enter a valid email."
- For incorrect phone number input, an error message should display: "Enter a valid phone number."
- For invalid numeric fields like **Age** or **Budget**, an error message should display: "Enter a valid age (18-99)." or "Enter a valid Budget" respectively.

---

### Use Case 2: Swiping Page with Fluid Animations

#### User Story
As a user, I want an engaging swiping page with fluid animations so I can quickly browse and evaluate potential roommates.

#### Execution Steps
1. Navigate to the "Recommendation" page in the app (The one with VT logo).
2. Swipe left or right on a profile card to reject or accept a match.
3. Observe the transition animation as the card moves out of view.
4. Repeat the swiping action for multiple profiles.

#### Expected Output
- The swiping animation should be smooth and responsive, without lag or glitches.
- Swiping left should dismiss the profile as "not interested."
- Swiping right should mark the profile as a potential match and populated in messaging page.
- Users should experience a seamless browsing experience with no functional errors.

---

### Use Case 3: Editing Profile Information

#### User Story
As a user, I want to edit my profile easily once I run out of swipes. This will allow me to update my preference and ensure accurate matching with potential roommates based on new features.

#### Execution Steps
1. Click the "Edit Profile" button shown when you run out of swipes.
2. Modify the following fields under "Roommate Preference" section:
   - Change the **Age** value.
   - Update the **Dietary Preference** to a new option.
   - Update the **Smoker** or **Drinker** option.
   - Update the **Ethinicity** option.
3. Click the "Continue" button to save the changes.
4. Redirects you to the recommendation page (the one with VT Logo).

#### Expected Output
- Clicking the "Continue" button should save the updated profile information.
- The modified fields should reflect the updated roommates on the "Recommendation" page.
- The backend database should also reflect the updated information when queried.

