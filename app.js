/**
 * Student Information System - AngularJS Client Runtime (app.js)
 * Phase 2: Hybrid System Architecture & Data Flow
 * 
 * Pipeline 1: Native Presentation (students.xml -> students.dtd -> students.xsl)
 * Pipeline 2: Dynamic AngularJS Application Engine ($scope, ng-model, ng-repeat, CRUD Handlers)
 */

(function () {
    'use strict';

    // Baseline Initial Records (Phase 3 Canonical Database)
    const INITIAL_STUDENTS = [
        { id: "S101", name: "Aarav Sharma", email: "aarav.sharma@engg.edu", department: "Computer Engineering", semester: 6, marks: 88 },
        { id: "S102", name: "Neha Patel", email: "neha.patel@engg.edu", department: "Information Technology", semester: 4, marks: 92 },
        { id: "S103", name: "Rohan Mehta", email: "rohan.mehta@engg.edu", department: "Electronics", semester: 6, marks: 74 },
        { id: "S104", name: "Pooja Verma", email: "pooja.verma@engg.edu", department: "Computer Engineering", semester: 8, marks: 65 },
        { id: "S105", name: "Siddharth Rao", email: "siddharth.rao@engg.edu", department: "Information Technology", semester: 2, marks: 38 }
    ];

    // Embedded XSLT Stylesheet for client-side XSLT rendering (Phase 6 Presentation Engine)
    const EMBEDDED_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <div class="report-card" style="max-width:960px; margin:0 auto; background:#ffffff; padding:25px; border-radius:12px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.08); border:1px solid #e2e8f0;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
                <h2 style="color:#0f172a; margin:0; font-size:1.25rem;">Academic Roster (Direct XML/XSLT Rendering)</h2>
                <span style="font-size:0.75rem; background:#e0e7ff; color:#3730a3; padding:4px 10px; border-radius:20px; font-weight:700;">Pipeline 1 Active</span>
            </div>
            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                <thead>
                    <tr style="background-color:#0f172a; color:#ffffff;">
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700; border-top-left-radius:8px;">Student ID</th>
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700;">Name</th>
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700;">Email</th>
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700;">Department</th>
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700;">Semester</th>
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700;">Marks</th>
                        <th style="padding:12px; text-align:left; font-size:13px; font-weight:700; border-top-right-radius:8px;">Academic Status</th>
                    </tr>
                </thead>
                <tbody>
                    <xsl:for-each select="students/student">
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:12px; font-size:13px;"><span style="font-family:monospace; font-weight:700; background:#e0e7ff; color:#3730a3; padding:3px 8px; border-radius:4px;"><xsl:value-of select="@id"/></span></td>
                            <td style="padding:12px; font-size:13px; font-weight:600; color:#0f172a;"><xsl:value-of select="name"/></td>
                            <td style="padding:12px; font-size:13px; color:#64748b;"><xsl:value-of select="email"/></td>
                            <td style="padding:12px; font-size:13px;"><span class="dept-pill dept-{department}" style="padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;"><xsl:value-of select="department"/></span></td>
                            <td style="padding:12px; font-size:13px; color:#475569;">Semester <xsl:value-of select="semester"/></td>
                            <td style="padding:12px; font-size:13px; font-weight:800;">
                                <xsl:choose>
                                    <xsl:when test="marks &lt; 40">
                                        <span style="color:#dc2626; background:#fee2e2; padding:3px 8px; border-radius:4px;"><xsl:value-of select="marks"/>%</span>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <span style="color:#16a34a; background:#dcfce7; padding:3px 8px; border-radius:4px;"><xsl:value-of select="marks"/>%</span>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </td>
                            <td style="padding:12px; font-size:13px;">
                                <xsl:choose>
                                    <xsl:when test="marks &gt;= 75">
                                        <span style="background:#dbeafe; color:#1e40af; padding:3px 8px; border-radius:4px; font-weight:700; font-size:12px;">Distinction</span>
                                    </xsl:when>
                                    <xsl:when test="marks &gt;= 40">
                                        <span style="background:#dcfce7; color:#166534; padding:3px 8px; border-radius:4px; font-weight:700; font-size:12px;">Passed</span>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <span style="background:#fee2e2; color:#991b1b; padding:3px 8px; border-radius:4px; font-weight:700; font-size:12px;">Remedial Required</span>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </td>
                        </tr>
                    </xsl:for-each>
                </tbody>
            </table>
        </div>
    </xsl:template>
</xsl:stylesheet>`;

    // Define AngularJS Module
    const app = angular.module('studentApp', []);

    // Define StudentController
    app.controller('StudentController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        // --- Phase 7 State Declarations & Reactive Models ---
        $scope.students = angular.copy(INITIAL_STUDENTS);

        // Reactive models for form processing and searching
        $scope.formData = {};
        $scope.isEditing = false;
        $scope.searchQuery = "";
        $scope.selectedDept = "";
        $scope.deptFilter = "ALL";
        $scope.semesterFilter = "ALL";
        $scope.statusMessage = "";
        $scope.hasError = false;

        $scope.departments = [
            "Computer Engineering",
            "Information Technology",
            "Electronics"
        ];

        // Core App Modes
        $scope.role = 'admin'; // 'admin' | 'faculty'
        $scope.activeTab = 'tab-records';
        $scope.sortField = 'id';
        $scope.sortReverse = false;

        // Modal Form Models
        $scope.isModalOpen = false;
        $scope.isViewModalOpen = false;
        $scope.formMode = 'create'; // 'create' | 'edit'
        $scope.formErrors = {};
        $scope.selectedStudent = null;

        // XML & DTD Studio Models
        $scope.xmlCode = '';
        $scope.validationResult = {
            isValid: true,
            title: 'All XML records conform to DTD & constraints',
            errors: [],
            studentCount: 0
        };

        // Toast Notification Model
        $scope.toast = {
            show: false,
            message: '',
            type: 'info'
        };

        // ==========================================
        // Phase 12: XML Integration & Dynamic Sync Bridge
        // ==========================================

        // Asynchronous hydration from students.xml
        $scope.loadFromXML = function() {
            $http.get("students.xml", {
                headers: { "Content-Type": "application/xml" },
                responseType: "text"
            }).then(function(response) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(response.data, "application/xml");

                // Check for parser errors
                var parseError = xmlDoc.getElementsByTagName("parsererror");
                if (parseError.length > 0) {
                    $scope.notifyUser("XML Parsing Error: Invalid structure in students.xml", true);
                    return;
                }

                var studentNodes = xmlDoc.getElementsByTagName("student");
                var loadedList = [];

                for (var i = 0; i < studentNodes.length; i++) {
                    var node = studentNodes[i];
                    loadedList.push({
                        id: node.getAttribute("id"),
                        name: node.getElementsByTagName("name")[0].textContent,
                        email: node.getElementsByTagName("email")[0].textContent,
                        department: node.getElementsByTagName("department")[0].textContent,
                        semester: parseInt(node.getElementsByTagName("semester")[0].textContent, 10),
                        marks: parseFloat(node.getElementsByTagName("marks")[0].textContent)
                    });
                }

                $scope.students = loadedList;
                $scope.saveState();
                $scope.notifyUser("Database synchronized with students.xml (" + loadedList.length + " records loaded)", false);
            }).catch(function(error) {
                console.warn("Direct XML sync unavailable (CORS/HTTP error). Retaining default array data.", error);
            });
        };

        // --- Initialization Lifecycle ---
        $scope.init = function () {
            $scope.loadData();
            $scope.loadFromXML(); // Phase 12: Asynchronous sync from students.xml
            $scope.syncXmlCode();
            $timeout(function () {
                $scope.renderXslt();
            }, 100);
        };

        // Load data from LocalStorage or Fallback to Initial Dataset
        $scope.loadData = function () {
            const saved = localStorage.getItem('STUDENT_INFO_DATA');
            if (saved) {
                try {
                    $scope.students = JSON.parse(saved);
                } catch (e) {
                    $scope.students = angular.copy(INITIAL_STUDENTS);
                }
            } else {
                $scope.students = angular.copy(INITIAL_STUDENTS);
            }
        };

        // Save state to LocalStorage and update XML representation
        $scope.saveState = function () {
            localStorage.setItem('STUDENT_INFO_DATA', JSON.stringify($scope.students));
            $scope.syncXmlCode();
        };

        // --- Persona / Role Switching ---
        $scope.setRole = function (newRole) {
            $scope.role = newRole;
            if (newRole === 'admin') {
                $scope.showToast('Switched to Administrator Mode (Full Privileges)', 'success');
            } else {
                $scope.showToast('Switched to Faculty / Evaluator Mode (Read-Only)', 'info');
                if ($scope.isModalOpen) $scope.closeModal();
            }
        };

        // --- Navigation Tabs ---
        $scope.switchTab = function (tabId) {
            $scope.activeTab = tabId;
            if (tabId === 'tab-xslt') {
                $timeout(function () {
                    $scope.renderXslt();
                }, 50);
            } else if (tabId === 'tab-dtd') {
                $scope.syncXmlCode();
            }
        };

        // --- Analytics Calculations ($scope expressions) ---
        $scope.getTotalStudents = function () {
            return $scope.students.length;
        };

        $scope.getAverageMarks = function () {
            if (!$scope.students.length) return '0.0';
            const sum = $scope.students.reduce((acc, s) => acc + Number(s.marks || 0), 0);
            return (sum / $scope.students.length).toFixed(1);
        };

        $scope.getHighestMarks = function () {
            if (!$scope.students.length) return '0.0';
            const max = Math.max(...$scope.students.map(s => Number(s.marks || 0)));
            return max.toFixed(1);
        };

        $scope.getPassRate = function () {
            if (!$scope.students.length) return '0';
            const pass = $scope.students.filter(s => Number(s.marks) >= 40).length;
            return Math.round((pass / $scope.students.length) * 100);
        };

        // --- Custom Query Filter for ng-repeat ---
        $scope.customFilter = function (student) {
            // Keyword match
            if ($scope.searchQuery) {
                const q = $scope.searchQuery.toLowerCase();
                const idMatch = student.id && student.id.toLowerCase().includes(q);
                const nameMatch = student.name && student.name.toLowerCase().includes(q);
                const emailMatch = student.email && student.email.toLowerCase().includes(q);
                if (!idMatch && !nameMatch && !emailMatch) return false;
            }

            // Department filter
            if ($scope.deptFilter !== 'ALL' && student.department !== $scope.deptFilter) {
                return false;
            }

            // Semester filter
            if ($scope.semesterFilter !== 'ALL' && String(student.semester) !== String($scope.semesterFilter)) {
                return false;
            }

            return true;
        };

        // --- Sorting Handler ---
        $scope.handleSortChange = function (sortVal) {
            switch (sortVal) {
                case 'id-asc': $scope.sortField = 'id'; $scope.sortReverse = false; break;
                case 'id-desc': $scope.sortField = 'id'; $scope.sortReverse = true; break;
                case 'name-asc': $scope.sortField = 'name'; $scope.sortReverse = false; break;
                case 'marks-desc': $scope.sortField = 'marks'; $scope.sortReverse = true; break;
                case 'marks-asc': $scope.sortField = 'marks'; $scope.sortReverse = false; break;
                default: $scope.sortField = 'id'; $scope.sortReverse = false;
            }
        };

        // --- CRUD Operations (AngularJS Event Handlers) ---

        // Open Add Modal
        $scope.openAddModal = function () {
            if ($scope.role !== 'admin') {
                $scope.showToast('Administrator privileges required.', 'error');
                return;
            }
            $scope.formMode = 'create';
            $scope.isEditing = false;
            $scope.formErrors = {};
            $scope.formData = {
                id: $scope.generateNextId(),
                name: '',
                email: '',
                department: $scope.departments[0],
                semester: 1,
                marks: ''
            };
            $scope.isModalOpen = true;
        };

        // Open Edit Modal
        $scope.openEditModal = function (student) {
            if ($scope.role !== 'admin') {
                $scope.showToast('Administrator privileges required.', 'error');
                return;
            }
            $scope.formMode = 'edit';
            $scope.isEditing = true;
            $scope.formErrors = {};
            $scope.formData = angular.copy(student);
            $scope.originalId = student.id;
            $scope.isModalOpen = true;
        };

        // Close Modal & Reset Form
        $scope.closeModal = function () {
            $scope.isModalOpen = false;
            $scope.resetForm();
        };

        // Reset Form State (Phase 8 Form Engineering)
        $scope.resetForm = function () {
            $scope.formData = {};
            $scope.isEditing = false;
            $scope.formMode = 'create';
            $scope.formErrors = {};
            if ($scope.studentForm) {
                $scope.studentForm.$setPristine();
                $scope.studentForm.$setUntouched();
            }
        };

        // ==========================================
        // Phase 10: Complete CRUD Operations
        // ==========================================

        // CREATE & UPDATE HANDLER
        $scope.saveStudent = function() {
            $scope.clearMessages();

            if (!$scope.formData || !$scope.formData.id) {
                $scope.notifyUser("Student ID is required.", true);
                return;
            }

            if ($scope.isEditing) {
                // UPDATE Existing Record
                var targetIndex = $scope.students.findIndex(function(s) {
                    return s.id === $scope.formData.id;
                });

                if (targetIndex !== -1) {
                    $scope.students[targetIndex] = angular.copy($scope.formData);
                    $scope.notifyUser("Student " + $scope.formData.id + " successfully updated.", false);
                    $scope.saveState();
                } else {
                    $scope.notifyUser("Record update failed: Target ID not found.", true);
                }
            } else {
                // CREATE New Record
                var idCandidate = String($scope.formData.id).trim().toUpperCase();
                var isDuplicate = $scope.students.some(function(s) {
                    return s.id.toUpperCase() === idCandidate;
                });

                if (isDuplicate) {
                    $scope.notifyUser("Error: Student ID '" + idCandidate + "' already exists. IDs must be unique.", true);
                    return;
                }

                var newRecord = angular.copy($scope.formData);
                newRecord.id = idCandidate;
                $scope.students.push(newRecord);
                $scope.notifyUser("Student registered successfully.", false);
                $scope.saveState();
            }

            $scope.resetForm();
            if ($scope.isModalOpen) {
                $scope.isModalOpen = false;
            }
        };

        // READ / PRE-FILL FOR EDIT
        $scope.editStudent = function(studentRecord) {
            $scope.formData = angular.copy(studentRecord);
            $scope.isEditing = true;
            $scope.clearMessages();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        // DELETE HANDLER
        $scope.deleteStudent = function(studentId) {
            if (confirm("Are you sure you want to permanently delete record: " + studentId + "?")) {
                var initialLength = $scope.students.length;
                $scope.students = $scope.students.filter(function(s) {
                    return s.id !== studentId;
                });

                if ($scope.students.length < initialLength) {
                    $scope.notifyUser("Student record " + studentId + " was removed.", false);
                    if ($scope.formData.id === studentId) {
                        $scope.resetForm();
                    }
                    $scope.saveState();
                }
            }
        };

        // HELPER STATE RESETS
        $scope.resetForm = function() {
            $scope.formData = {};
            $scope.isEditing = false;
            if ($scope.studentForm) {
                $scope.studentForm.$setPristine();
                $scope.studentForm.$setUntouched();
            }
        };

        $scope.notifyUser = function(message, isError) {
            $scope.statusMessage = message;
            $scope.hasError = isError;
            $scope.showToast(message, isError ? 'error' : 'success');
        };

        $scope.clearMessages = function() {
            $scope.statusMessage = "";
            $scope.hasError = false;
        };

        // View Student Grade Card Modal
        $scope.viewStudentCard = function (student) {
            $scope.selectedStudent = angular.copy(student);
            const m = Number(student.marks);
            let grade = 'F';
            let label = 'Fail';
            let gradeClass = 'grade-F';

            if (m >= 90) { grade = 'O'; label = 'Outstanding'; gradeClass = 'grade-O'; }
            else if (m >= 75) { grade = 'A'; label = 'Distinction'; gradeClass = 'grade-A'; }
            else if (m >= 60) { grade = 'B'; label = 'First Class'; gradeClass = 'grade-B'; }
            else if (m >= 40) { grade = 'C'; label = 'Pass'; gradeClass = 'grade-C'; }

            $scope.selectedStudent.isPass = m >= 40;
            $scope.selectedStudent.gradeLetter = grade;
            $scope.selectedStudent.gradeLabel = label;
            $scope.selectedStudent.gradeClass = gradeClass;
            $scope.isViewModalOpen = true;
        };

        $scope.closeViewModal = function () {
            $scope.isViewModalOpen = false;
            $scope.selectedStudent = null;
        };

        // --- XML & DTD Studio Operations ---

        $scope.generateXmlString = function (list = $scope.students) {
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            xml += `<!DOCTYPE students SYSTEM "students.dtd">\n`;
            xml += `<?xml-stylesheet type="text/xsl" href="students.xsl"?>\n`;
            xml += `<students>\n`;
            list.forEach(s => {
                xml += `    <student id="${$scope.escapeXml(s.id)}">\n`;
                xml += `        <name>${$scope.escapeXml(s.name)}</name>\n`;
                xml += `        <email>${$scope.escapeXml(s.email)}</email>\n`;
                xml += `        <department>${$scope.escapeXml(s.department)}</department>\n`;
                xml += `        <semester>${s.semester}</semester>\n`;
                xml += `        <marks>${Number(s.marks).toFixed(1)}</marks>\n`;
                xml += `    </student>\n`;
            });
            xml += `</students>\n`;
            return xml;
        };

        $scope.syncXmlCode = function () {
            $scope.xmlCode = $scope.generateXmlString();
        };

        $scope.validateXmlDtd = function () {
            const diag = $scope.validateXmlInternal($scope.xmlCode);
            $scope.validationResult = diag;
            if (diag.isValid) {
                $scope.showToast('XML Document is 100% Valid against DTD Schema!', 'success');
            } else {
                $scope.showToast('Validation failed! Check diagnostics.', 'error');
            }
        };

        $scope.validateXmlInternal = function (xmlString) {
            const diag = {
                isValid: true,
                errors: [],
                studentCount: 0
            };

            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, "text/xml");

            const parserError = doc.querySelector("parsererror");
            if (parserError) {
                diag.isValid = false;
                diag.errors.push(`XML Syntax Error: ${parserError.textContent.slice(0, 150)}`);
                return diag;
            }

            const root = doc.documentElement;
            if (root.nodeName !== 'students') {
                diag.isValid = false;
                diag.errors.push(`Root element mismatch: Expected <students>, found <${root.nodeName}>`);
                return diag;
            }

            const studentElements = doc.querySelectorAll('students > student');
            diag.studentCount = studentElements.length;

            // DTD Rule: <!ELEMENT students (student+)> (At least one student required)
            if (studentElements.length === 0) {
                diag.isValid = false;
                diag.errors.push("DTD Violation: Root element <students> must contain at least one <student> record (enforced by student+).");
                return diag;
            }

            const ids = new Set();
            const emails = new Set();

            studentElements.forEach((el, index) => {
                const idx = index + 1;
                const id = el.getAttribute('id');

                if (!id) {
                    diag.isValid = false;
                    diag.errors.push(`Student #${idx}: Missing required attribute 'id' (DTD: #REQUIRED).`);
                } else {
                    if (!/^S\d{3,}$/.test(id)) {
                        diag.isValid = false;
                        diag.errors.push(`Student #${idx} (${id}): Invalid ID format. Must match regex 'S\\d{3,}'`);
                    }
                    if (ids.has(id)) {
                        diag.isValid = false;
                        diag.errors.push(`Duplicate XML ID detected: '${id}'. ID attributes must be strictly unique.`);
                    } else {
                        ids.add(id);
                    }
                }

                // Strict DTD Sequence Enforcement: (name, email, department, semester, marks)
                const expectedSequence = ['name', 'email', 'department', 'semester', 'marks'];
                const actualChildren = Array.from(el.children).map(c => c.nodeName);

                // Check missing mandatory elements
                expectedSequence.forEach(exp => {
                    if (!actualChildren.includes(exp)) {
                        diag.isValid = false;
                        diag.errors.push(`Student #${idx} (${id || 'Unknown'}): Missing mandatory element <${exp}>. (DTD sequence requires: name, email, department, semester, marks)`);
                    }
                });

                // Check exact sequential ordering
                let seqValid = true;
                for (let i = 0; i < actualChildren.length && i < expectedSequence.length; i++) {
                    if (actualChildren[i] !== expectedSequence[i]) {
                        seqValid = false;
                        diag.isValid = false;
                        diag.errors.push(`Student #${idx} (${id || 'Unknown'}): Invalid element ordering. Found <${actualChildren[i]}>, expected <${expectedSequence[i]}> at position ${i+1}.`);
                        break;
                    }
                }

                const nameEl = el.querySelector('name');
                const emailEl = el.querySelector('email');
                const deptEl = el.querySelector('department');
                const semEl = el.querySelector('semester');
                const marksEl = el.querySelector('marks');

                if (nameEl && !/^[A-Za-z\s]{1,50}$/.test(nameEl.textContent.trim())) {
                    diag.isValid = false;
                    diag.errors.push(`Student ${id || '#' + idx}: Name '${nameEl.textContent}' invalid. Max 50 alphabetic/spaces.`);
                }

                if (emailEl) {
                    const em = emailEl.textContent.trim();
                    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(em)) {
                        diag.isValid = false;
                        diag.errors.push(`Student ${id || '#' + idx}: Email '${em}' invalid RFC 5322 pattern.`);
                    }
                    if (emails.has(em.toLowerCase())) {
                        diag.isValid = false;
                        diag.errors.push(`Student ${id || '#' + idx}: Duplicate email '${em}' detected.`);
                    } else {
                        emails.add(em.toLowerCase());
                    }
                }

                if (deptEl && !['Computer Engineering', 'Information Technology', 'Electronics', 'CE', 'IT', 'EXTC'].includes(deptEl.textContent.trim())) {
                    diag.isValid = false;
                    diag.errors.push(`Student ${id || '#' + idx}: Department '${deptEl.textContent}' invalid. Allowed: [Computer Engineering, Information Technology, Electronics]`);
                }

                if (semEl) {
                    const sVal = parseInt(semEl.textContent.trim(), 10);
                    if (isNaN(sVal) || sVal < 1 || sVal > 8) {
                        diag.isValid = false;
                        diag.errors.push(`Student ${id || '#' + idx}: Semester '${semEl.textContent}' out of bounds [1-8].`);
                    }
                }

                if (marksEl) {
                    const mVal = parseFloat(marksEl.textContent.trim());
                    if (isNaN(mVal) || mVal < 0 || mVal > 100) {
                        diag.isValid = false;
                        diag.errors.push(`Student ${id || '#' + idx}: Marks '${marksEl.textContent}' out of bounds [0-100].`);
                    }
                }
            });

            return diag;
        };

        // Fault Injection Test Scenarios for Demonstration & Lab Verification
        $scope.injectFault = function (type) {
            if (type === 'missing_node') {
                $scope.xmlCode = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="students.xsl"?>
<!DOCTYPE students SYSTEM "students.dtd">
<students>
    <student id="S106">
        <name>Anil</name>
        <department>Information Technology</department>
    </student>
</students>`;
                $scope.showToast('Injected Fault: Missing mandatory <email>, <semester>, <marks> nodes', 'error');
            } else if (type === 'duplicate_id') {
                $scope.xmlCode = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="students.xsl"?>
<!DOCTYPE students SYSTEM "students.dtd">
<students>
    <student id="S101">
        <name>Aarav Sharma</name>
        <email>aarav.sharma@engg.edu</email>
        <department>Computer Engineering</department>
        <semester>6</semester>
        <marks>88</marks>
    </student>
    <student id="S101">
        <name>Duplicate Record</name>
        <email>duplicate@engg.edu</email>
        <department>Information Technology</department>
        <semester>4</semester>
        <marks>75</marks>
    </student>
</students>`;
                $scope.showToast('Injected Fault: Duplicate Primary Key ID (S101)', 'error');
            } else if (type === 'invalid_order') {
                $scope.xmlCode = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="students.xsl"?>
<!DOCTYPE students SYSTEM "students.dtd">
<students>
    <student id="S101">
        <email>aarav.sharma@engg.edu</email>
        <name>Aarav Sharma</name>
        <department>Computer Engineering</department>
        <semester>6</semester>
        <marks>88</marks>
    </student>
</students>`;
                $scope.showToast('Injected Fault: Invalid Element Ordering (<email> before <name>)', 'error');
            } else if (type === 'restore') {
                $scope.syncXmlCode();
                $scope.showToast('Restored Canonical Valid XML', 'success');
            }
            $scope.validateXmlDtd();
        };

        // Apply XML in code editor to dynamic collection
        $scope.applyXmlToRegistry = function () {
            if ($scope.role !== 'admin') {
                $scope.showToast('Administrator privileges required.', 'error');
                return;
            }

            const diag = $scope.validateXmlInternal($scope.xmlCode);
            $scope.validationResult = diag;

            if (!diag.isValid) {
                alert('Cannot apply invalid XML! Please fix the errors in the diagnostics pane.');
                return;
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString($scope.xmlCode, "text/xml");
            const studentEls = doc.querySelectorAll('students > student');

            const updated = [];
            studentEls.forEach(el => {
                updated.push({
                    id: el.getAttribute('id'),
                    name: el.querySelector('name').textContent.trim(),
                    email: el.querySelector('email').textContent.trim(),
                    department: el.querySelector('department').textContent.trim(),
                    semester: parseInt(el.querySelector('semester').textContent.trim(), 10),
                    marks: parseFloat(el.querySelector('marks').textContent.trim())
                });
            });

            $scope.students = updated;
            $scope.saveState();
            $scope.showToast(`Applied ${updated.length} records from XML!`, 'success');
        };

        // --- XSLT Transformation Pipeline ---
        $scope.renderXslt = function () {
            const container = document.getElementById('xsltRenderOutput');
            if (!container) return;

            try {
                const xmlStr = $scope.generateXmlString();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
                const xslDoc = parser.parseFromString(EMBEDDED_XSLT, "text/xml");

                if (window.XSLTProcessor) {
                    const processor = new XSLTProcessor();
                    processor.importStylesheet(xslDoc);
                    const fragment = processor.transformToFragment(xmlDoc, document);
                    container.innerHTML = '';
                    container.appendChild(fragment);
                } else {
                    container.innerHTML = `<p>XSLT Native Engine Active</p>`;
                }
            } catch (err) {
                console.error("XSLT Error:", err);
                container.innerHTML = `<div class="alert alert-danger">XSLT Rendering Error: ${$scope.escapeHtml(err.message)}</div>`;
            }
        };

        // --- Import / Export ---
        $scope.exportXml = function () {
            const xml = $scope.generateXmlString();
            const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'students.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            $scope.showToast('Exported students.xml successfully!', 'success');
        };

        $scope.handleXmlImport = function ($event) {
            const file = $event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                const diag = $scope.validateXmlInternal(content);

                $scope.$apply(function () {
                    $scope.validationResult = diag;
                    if (!diag.isValid) {
                        $scope.switchTab('tab-dtd');
                        alert('The uploaded XML file contains schema violations! Check the DTD diagnostics.');
                        return;
                    }

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, "text/xml");
                    const els = doc.querySelectorAll('students > student');

                    const imported = [];
                    els.forEach(el => {
                        imported.push({
                            id: el.getAttribute('id'),
                            name: el.querySelector('name').textContent.trim(),
                            email: el.querySelector('email').textContent.trim(),
                            department: el.querySelector('department').textContent.trim(),
                            semester: parseInt(el.querySelector('semester').textContent.trim(), 10),
                            marks: parseFloat(el.querySelector('marks').textContent.trim())
                        });
                    });

                    $scope.students = imported;
                    $scope.saveState();
                    $scope.switchTab('tab-records');
                    $scope.showToast(`Imported ${imported.length} student records!`, 'success');
                });
            };
            reader.readAsText(file);
            $event.target.value = '';
        };

        $scope.resetData = function () {
            if (confirm('Reset student records to baseline dataset?')) {
                $scope.students = angular.copy(INITIAL_STUDENTS);
                $scope.saveState();
                $scope.showToast('Reset records to baseline dataset.', 'info');
            }
        };

        // --- Helpers ---
        $scope.showToast = function (msg, type = 'info') {
            $scope.toast.message = msg;
            $scope.toast.type = type;
            $scope.toast.show = true;
            $timeout(function () {
                $scope.toast.show = false;
            }, 3200);
        };

        $scope.escapeHtml = function (str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        $scope.escapeXml = function (str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };

        // Initialize on controller load
        $scope.init();
    }]);

})();
