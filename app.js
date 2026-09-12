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

    // Embedded XSLT Stylesheet for client-side XSLT rendering
    const EMBEDDED_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    <xsl:template match="/">
        <div class="xslt-rendered-view">
            <div class="xslt-header" style="text-align:center; margin-bottom:24px; padding:20px; background:linear-gradient(135deg,#0f172a,#1e293b); color:#fff; border-radius:12px;">
                <h2 style="margin:0 0 6px 0; font-size:1.4rem;">Official Academic Grade Cards &amp; Transcripts</h2>
                <p style="margin:0; color:#94a3b8; font-size:0.85rem;">Generated via XSLT Presentation Pipeline (students.xml + students.xsl)</p>
            </div>
            <div class="student-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
                <xsl:for-each select="students/student">
                    <xsl:sort select="marks" data-type="number" order="descending"/>
                    <div class="grade-card" style="background:#fff; border-radius:12px; border:1px solid #e2e8f0; padding:18px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px; margin-bottom:12px;">
                                <span style="font-weight:700; font-family:monospace; background:#e0e7ff; color:#3730a3; padding:3px 8px; border-radius:6px; font-size:0.85rem;"><xsl:value-of select="@id"/></span>
                                <span style="font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:12px; text-transform:uppercase;" class="dept-pill dept-{department}"><xsl:value-of select="department"/></span>
                            </div>
                            <h3 style="font-size:1.1rem; font-weight:700; margin:0 0 4px 0; color:#0f172a;"><xsl:value-of select="name"/></h3>
                            <div style="font-size:0.8rem; color:#64748b; margin-bottom:12px;"><xsl:value-of select="email"/></div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:14px; font-size:0.8rem;">
                                <div>
                                    <div style="color:#64748b; font-size:0.7rem; font-weight:600; text-transform:uppercase;">Semester</div>
                                    <div style="font-weight:700; color:#0f172a;">Term <xsl:value-of select="semester"/></div>
                                </div>
                                <div>
                                    <div style="color:#64748b; font-size:0.7rem; font-weight:600; text-transform:uppercase;">Status</div>
                                    <div style="font-weight:700;">
                                        <xsl:choose>
                                            <xsl:when test="marks &gt;= 40"><span style="color:#10b981;">PASS</span></xsl:when>
                                            <xsl:otherwise><span style="color:#ef4444;">ARREAR</span></xsl:otherwise>
                                        </xsl:choose>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px dashed #e2e8f0;">
                            <span style="font-size:1.25rem; font-weight:800; color:#4f46e5;"><xsl:value-of select="marks"/>%</span>
                            <xsl:choose>
                                <xsl:when test="marks &gt;= 90">
                                    <span style="background:#10b981; color:#fff; padding:3px 10px; border-radius:6px; font-size:0.75rem; font-weight:700;">Grade O (Outstanding)</span>
                                </xsl:when>
                                <xsl:when test="marks &gt;= 75">
                                    <span style="background:#3b82f6; color:#fff; padding:3px 10px; border-radius:6px; font-size:0.75rem; font-weight:700;">Grade A (Distinction)</span>
                                </xsl:when>
                                <xsl:when test="marks &gt;= 60">
                                    <span style="background:#f59e0b; color:#fff; padding:3px 10px; border-radius:6px; font-size:0.75rem; font-weight:700;">Grade B (First Class)</span>
                                </xsl:when>
                                <xsl:when test="marks &gt;= 40">
                                    <span style="background:#6366f1; color:#fff; padding:3px 10px; border-radius:6px; font-size:0.75rem; font-weight:700;">Grade C (Pass)</span>
                                </xsl:when>
                                <xsl:otherwise>
                                    <span style="background:#ef4444; color:#fff; padding:3px 10px; border-radius:6px; font-size:0.75rem; font-weight:700;">Grade F (Fail)</span>
                                </xsl:otherwise>
                            </xsl:choose>
                        </div>
                    </div>
                </xsl:for-each>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>`;

    // Define AngularJS Module
    const app = angular.module('studentApp', []);

    // Define StudentController
    app.controller('StudentController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

        // --- Core Model State ---
        $scope.role = 'admin'; // 'admin' | 'faculty'
        $scope.activeTab = 'tab-records';
        $scope.students = [];

        // Filters and Search Models (Two-way binding)
        $scope.searchQuery = '';
        $scope.deptFilter = 'ALL';
        $scope.semesterFilter = 'ALL';
        $scope.sortField = 'id';
        $scope.sortReverse = false;

        // Modal Form Models
        $scope.isModalOpen = false;
        $scope.isViewModalOpen = false;
        $scope.formMode = 'create'; // 'create' | 'edit'
        $scope.formData = {};
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

        // --- Initialization Lifecycle ---
        $scope.init = function () {
            $scope.loadData();
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
            $scope.formErrors = {};
            $scope.formData = {
                id: $scope.generateNextId(),
                name: '',
                email: '',
                department: 'CE',
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
            $scope.formErrors = {};
            $scope.formData = angular.copy(student);
            $scope.originalId = student.id;
            $scope.isModalOpen = true;
        };

        // Close Modal
        $scope.closeModal = function () {
            $scope.isModalOpen = false;
            $scope.formData = {};
            $scope.formErrors = {};
        };

        // Generate next automatic ID
        $scope.generateNextId = function () {
            const existing = $scope.students.map(s => {
                const m = (s.id || '').match(/^S(\d+)$/);
                return m ? parseInt(m[1], 10) : 100;
            });
            const max = existing.length ? Math.max(...existing) : 100;
            return `S${max + 1}`;
        };

        // Save Student (Create or Update)
        $scope.saveStudent = function () {
            if ($scope.role !== 'admin') return;

            $scope.formErrors = {};
            let isValid = true;

            const id = ($scope.formData.id || '').trim();
            const name = ($scope.formData.name || '').trim();
            const email = ($scope.formData.email || '').trim();
            const dept = $scope.formData.department;
            const sem = parseInt($scope.formData.semester, 10);
            const marks = parseFloat($scope.formData.marks);

            // 1. ID Rule: S\d{3,} + XML ID uniqueness
            const idPattern = /^S\d{3,}$/;
            if (!idPattern.test(id)) {
                $scope.formErrors.id = "Invalid ID! Must match pattern 'S' followed by 3+ digits (e.g. S101, S1001).";
                isValid = false;
            } else if ($scope.formMode === 'create' && $scope.students.some(s => s.id.toUpperCase() === id.toUpperCase())) {
                $scope.formErrors.id = "Student ID must be unique across all records.";
                isValid = false;
            }

            // 2. Name Rule: Max 50 chars, alphabetic and spaces
            const namePattern = /^[A-Za-z\s]{1,50}$/;
            if (!namePattern.test(name)) {
                $scope.formErrors.name = "Name must contain only alphabetic characters and spaces (max 50 chars).";
                isValid = false;
            }

            // 3. Email Rule: RFC 5322 pattern + uniqueness
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                $scope.formErrors.email = "Enter a valid RFC 5322 compliant institute email address.";
                isValid = false;
            } else {
                const dup = $scope.students.find(s => 
                    s.email.toLowerCase() === email.toLowerCase() && 
                    ($scope.formMode === 'create' || s.id !== $scope.originalId)
                );
                if (dup) {
                    $scope.formErrors.email = `Email is already registered to student ${dup.id}.`;
                    isValid = false;
                }
            }

            // 4. Department: [Computer Engineering, Information Technology, Electronics, CE, IT, EXTC]
            const allowedDepts = ['Computer Engineering', 'Information Technology', 'Electronics', 'CE', 'IT', 'EXTC'];
            if (!allowedDepts.includes(dept)) {
                $scope.formErrors.department = "Department must be one of: Computer Engineering, Information Technology, Electronics (or CE, IT, EXTC).";
                isValid = false;
            }

            // 5. Semester: 1 <= semester <= 8
            if (isNaN(sem) || sem < 1 || sem > 8) {
                $scope.formErrors.semester = "Semester must be an integer between 1 and 8.";
                isValid = false;
            }

            // 6. Marks: 0 <= marks <= 100
            if (isNaN(marks) || marks < 0 || marks > 100) {
                $scope.formErrors.marks = "Marks score must be a number between 0.0 and 100.0.";
                isValid = false;
            }

            if (!isValid) return;

            const record = {
                id: id,
                name: name,
                email: email,
                department: dept,
                semester: sem,
                marks: marks
            };

            if ($scope.formMode === 'create') {
                $scope.students.push(record);
                $scope.showToast(`Enrolled new student ${id} successfully!`, 'success');
            } else {
                const idx = $scope.students.findIndex(s => s.id === $scope.originalId);
                if (idx !== -1) {
                    $scope.students[idx] = record;
                    $scope.showToast(`Updated record for student ${id}!`, 'success');
                }
            }

            $scope.saveState();
            $scope.closeModal();
        };

        // Delete Student Record
        $scope.deleteStudent = function (studentId) {
            if ($scope.role !== 'admin') {
                $scope.showToast('Administrator privileges required.', 'error');
                return;
            }
            if (confirm(`Are you sure you want to delete student ${studentId}?`)) {
                $scope.students = $scope.students.filter(s => s.id !== studentId);
                $scope.saveState();
                $scope.showToast(`Removed student ${studentId} from registry.`, 'success');
            }
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
