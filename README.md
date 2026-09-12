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

## 📁 Folder Hierarchy & Component Map

```plaintext
StudentInformationSystem/
│
├── index.html              # Interactive Single-Page Application Dashboard (AngularJS)
├── style.css               # Component layout, 3-column CSS Grid & responsive styling
├── styles.css              # Extended design token library & glassmorphic styling
├── app.js                  # AngularJS controllers, filters, and XML async bridge
├── students.xml            # Canonical native XML database with DTD & XSL processing instructions
├── students.dtd            # Structural DTD schema with sequence & ID uniqueness rules
├── students.xsd            # XML Schema Definition (XSD) with strong typing & boundary facets
├── students.xsl            # XSLT presentation engine for direct in-browser report rendering
├── gradecard.xsl           # Specialized individual student academic grade card XSLT template
├── validate.js             # Standalone XML/DTD validator utility
├── test_e2e.js             # Automated end-to-end verification test suite (6/6 passing)
├── VIVA_GUIDE.md           # Comprehensive Viva Voce Q&A and technical defense preparation
└── README.md               # Project documentation and architectural blueprint
```

---

## 🚀 Local Execution & Deployment Guide

> **Note on Browser Security & CORS**:
> Browsers restrict local file reads (`file://`) for asynchronous `$http.get` / `fetch` requests due to the browser's Same-Origin Policy. To experience all dynamic XML-AngularJS synchronization features, launch via a local HTTP server:

### Option 1: Python 3 (Built-in)
```bash
# Start server in the project directory
python -m http.server 8000
```
Then navigate to:
- **AngularJS Dashboard**: [http://localhost:8000/index.html](http://localhost:8000/index.html)
- **Native XSLT Engine**: [http://localhost:8000/students.xml](http://localhost:8000/students.xml)

### Option 2: Node.js `http-server`
```bash
npx http-server -p 8000 -c-1
```

### Option 3: PHP Built-in Server
```bash
php -S localhost:8000
```

### Option 4: VS Code Live Server Extension
Right-click `index.html` or `students.xml` and select **"Open with Live Server"**.

---

## 🎓 Viva Voce & Technical Defense Preparation

For an exhaustive, examiner-ready defense guide covering XML 1.0, DTD grammar, XSD vs DTD tradeoffs, XSLT XPath transformations, AngularJS MVVM architecture, and data binding internals, consult:

👉 **[Comprehensive Viva Voce Guide (VIVA_GUIDE.md)](file:///d:/STUDENT_INFO/VIVA_GUIDE.md)**

---

## 🧪 Running Automated Test Suite

1. **Execute All 6 End-to-End Test Scenarios**:
   ```bash
   node test_e2e.js
   ```
2. **Execute XML & DTD Structural Validation**:
   ```bash
   node validate.js
   ```

