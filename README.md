# Student Academic Information System

A portable, self-contained hybrid web platform for academic student record management featuring native client-side XML/DTD schema verification, XSLT document transformation, and an interactive AngularJS single-page dashboard.

---

## 🏛️ System Architecture

The application implements a **Dual-Pipeline Architecture**:

```plaintext
[ 1. Data Presentation Pipeline ]
+-------------------+        +--------------------+
|   students.xml    | -----> |    students.dtd    | (Structural Validation)
+-------------------+        +--------------------+
          |
          v
+-------------------+
|   students.xsl    | -----> [ Native Browser Engine ] -----> Styled HTML Report
+-------------------+

--------------------------------------------------------------------------------

[ 2. Dynamic Application Pipeline ]
+-------------------+
|   students.xml    |
+-------------------+
          |
     (DOMParser /
       $http.get)
          v
+-----------------------------------------------------------------------------+
| AngularJS Client Runtime (app.js)                                           |
|  - $scope.students: In-memory Collection                                    |
|  - Two-Way Model Binding (ng-model)                                         |
|  - Real-Time Query Filter (ng-repeat="s in students | filter:query")        |
|  - CRUD Event Handlers (saveStudent, editStudent, deleteStudent)            |
+-----------------------------------------------------------------------------+
          |
          v
+-----------------------------------------------------------------------------+
| Interactive Single Page Dashboard (index.html + style.css)                 |
|  - Responsive Form Grid                                                     |
|  - Live Search Toolbar                                                      |
|  - Mutating Student Data Table                                              |
+-----------------------------------------------------------------------------+
```

---

## 📋 Entity Data Dictionary

| Field Name | Type / Format | Constraints | System Verification Rule | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String (`S\d{3,}`) | Primary Key, Unique, XML ID | `^S\d{3,}$` (e.g. S101, S102) | Unique identifier conforming to XML ID token requirements |
| `name` | String | Max 50 chars, Alphabetic & spaces | `^[A-Za-z\s]{1,50}$` | Student's registered full name |
| `email` | String | RFC 5322 pattern, Unique | RFC 5322 Email regex | Institute-issued communication address |
| `department` | String | Enumerated | Computer Engineering, Information Technology, Electronics | Degree branch / Engineering department |
| `semester` | Integer | Range `1 <= semester <= 8` | `1 <= semester <= 8` | Current enrolled academic term |
| `marks` | Float / Int | Range `0 <= marks <= 100` | `0.0 <= marks <= 100.0` | Aggregate percentage / performance score |

---

## 🧪 End-to-End Test Matrix & Verification

| Test Scenario | Input Action | Expected Behavior | Actual System Verdict |
| :--- | :--- | :--- | :--- |
| **DTD Entity Validation** | Delete `<email>` node from `students.xml` and run validator | Validator reports a sequence violation and rejects the file | ✅ Conforms (Fails parsing) |
| **Duplicate ID Restriction** | Input `S101` in the Add Form and submit | Alert displays stating the ID already exists; array length is unchanged | ✅ Conforms (Action blocked) |
| **Primary Key Immutability** | Click "Edit" on row `S102` | Student ID field switches to disabled (`ng-disabled="true"`) | ✅ Conforms (Field locked) |
| **Dynamic Multi-Search** | Type "Computer" in the search bar | Table updates to display only Computer Engineering students | ✅ Conforms (Immediate update) |
| **Record Elimination** | Click "Delete" on `S103` and confirm prompt | Row `S103` is removed from the view and `$scope.students` | ✅ Conforms (Array updated) |
| **Empty State Fallback** | Type an unmatched string like "XYZ999" | Table hides body rows and presents "No matching student records found" | ✅ Conforms (Fallback rendered) |

---

## 🚀 Running Tests & Launching

1. **Run Automated Test Matrix**:
   ```bash
   node test_e2e.js
   ```
2. **Run Standalone XML/DTD Validator**:
   ```bash
   node validate.js
   ```
3. **Launch Web Application**:
   Open `index.html` directly in any modern browser.
