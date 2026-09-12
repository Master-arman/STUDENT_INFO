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
| `department` | String | Enumerated (`CE`, `IT`, `EXTC`) | `CE`, `IT`, `EXTC` | Degree branch / Engineering department |
| `semester` | Integer | Range `1 <= semester <= 8` | `1 <= semester <= 8` | Current enrolled academic term |
| `marks` | Float / Int | Range `0 <= marks <= 100` | `0.0 <= marks <= 100.0` | Aggregate percentage / performance score |

---

## 👥 User Roles & Personas

- **Administrator**: Full CRUD access (enroll students, edit records, delete records), live XML editor with real-time DTD schema validation, and XML export/import.
- **Faculty / Evaluator**: Read-only access with instant multi-parameter keyword search, department and semester filtering, score inspection, and dynamic XSLT grade card rendering.

---

## 🚀 Getting Started

No build tools or server dependencies required!

1. Clone or download this repository:
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   ```
2. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).
