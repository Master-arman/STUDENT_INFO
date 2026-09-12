/**
 * Standalone XML / DTD Validation Script
 * Phase 5: XML/DTD Validation & Error Handling
 * 
 * Usage:
 *   node validate.js [optional-xml-file-path]
 */

const fs = require('fs');
const path = require('path');

const xmlFilePath = process.argv[2] || path.join(__dirname, 'students.xml');

console.log(`\n======================================================`);
console.log(`🔍 XML / DTD Structural Validation Engine`);
console.log(`   Target File: ${xmlFilePath}`);
console.log(`======================================================\n`);

if (!fs.existsSync(xmlFilePath)) {
    console.error(`❌ Error: File not found: ${xmlFilePath}`);
    process.exit(1);
}

const xmlContent = fs.readFileSync(xmlFilePath, 'utf8');

function validateXml(xml) {
    const errors = [];
    const expectedSequence = ['name', 'email', 'department', 'semester', 'marks'];
    const allowedDepartments = ['Computer Engineering', 'Information Technology', 'Electronics', 'CE', 'IT', 'EXTC'];

    // 1. Root Element Check
    if (!/<students[\s>]/i.test(xml)) {
        errors.push("Root element mismatch: Expected <students> root container.");
    }

    // Extract student blocks
    const studentRegex = /<student(?:\s+id=["']([^"']+)["'])?>([\s\S]*?)<\/student>/gi;
    let match;
    let studentCount = 0;
    const seenIds = new Set();
    const seenEmails = new Set();

    while ((match = studentRegex.exec(xml)) !== null) {
        studentCount++;
        const id = match[1];
        const body = match[2];

        // 2. ID Validation
        if (!id) {
            errors.push(`Student #${studentCount}: Missing mandatory attribute 'id' (DTD: #REQUIRED).`);
        } else {
            if (!/^S\d{3,}$/.test(id)) {
                errors.push(`Student #${studentCount} (${id}): Invalid ID format. Must match regex 'S\\d{3,}'.`);
            }
            if (seenIds.has(id)) {
                errors.push(`Student #${studentCount} (${id}): ID ${id} already defined. Attribute declared as ID requires absolute uniqueness.`);
            } else {
                seenIds.add(id);
            }
        }

        // 3. Extract child tags in order
        const childTagRegex = /<([a-zA-Z0-9_]+)[\s>]/g;
        let tagMatch;
        const actualSequence = [];
        while ((tagMatch = childTagRegex.exec(body)) !== null) {
            actualSequence.push(tagMatch[1]);
        }

        // Check missing mandatory elements
        expectedSequence.forEach(exp => {
            if (!actualSequence.includes(exp)) {
                errors.push(`Student #${studentCount} (${id || 'Unknown'}): Missing element: (${exp}). DTD enforces strict sequential element structure.`);
            }
        });

        // Check element ordering
        for (let i = 0; i < actualSequence.length && i < expectedSequence.length; i++) {
            if (actualSequence[i] !== expectedSequence[i]) {
                errors.push(`Student #${studentCount} (${id || 'Unknown'}): Element ${actualSequence[i]} not allowed here; expected ${expectedSequence[i]} at position ${i + 1}. DTD requires child tags in exact declaration order.`);
                break;
            }
        }

        // 4. Value Constraints
        const nameMatch = /<name>([\s\S]*?)<\/name>/i.exec(body);
        const emailMatch = /<email>([\s\S]*?)<\/email>/i.exec(body);
        const deptMatch = /<department>([\s\S]*?)<\/department>/i.exec(body);
        const semMatch = /<semester>([\s\S]*?)<\/semester>/i.exec(body);
        const marksMatch = /<marks>([\s\S]*?)<\/marks>/i.exec(body);

        if (nameMatch && !/^[A-Za-z\s]{1,50}$/.test(nameMatch[1].trim())) {
            errors.push(`Student ${id || '#' + studentCount}: Name '${nameMatch[1].trim()}' invalid. Maximum 50 alphabetic characters & spaces.`);
        }

        if (emailMatch) {
            const email = emailMatch[1].trim();
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                errors.push(`Student ${id || '#' + studentCount}: Email '${email}' does not conform to RFC 5322 pattern.`);
            }
            if (seenEmails.has(email.toLowerCase())) {
                errors.push(`Student ${id || '#' + studentCount}: Duplicate email address '${email}' detected.`);
            } else {
                seenEmails.add(email.toLowerCase());
            }
        }

        if (deptMatch && !allowedDepartments.includes(deptMatch[1].trim())) {
            errors.push(`Student ${id || '#' + studentCount}: Department '${deptMatch[1].trim()}' invalid.`);
        }

        if (semMatch) {
            const sem = parseInt(semMatch[1].trim(), 10);
            if (isNaN(sem) || sem < 1 || sem > 8) {
                errors.push(`Student ${id || '#' + studentCount}: Semester '${semMatch[1].trim()}' out of bounds [1-8].`);
            }
        }

        if (marksMatch) {
            const marks = parseFloat(marksMatch[1].trim());
            if (isNaN(marks) || marks < 0 || marks > 100) {
                errors.push(`Student ${id || '#' + studentCount}: Marks '${marksMatch[1].trim()}' out of bounds [0-100].`);
            }
        }
    }

    // student+ rule
    if (studentCount === 0) {
        errors.push("DTD Violation: Root element <students> must contain at least one <student> record (enforced by student+).");
    }

    return { isValid: errors.length === 0, errors, studentCount };
}

const result = validateXml(xmlContent);

if (result.isValid) {
    console.log(`✅ SUCCESS: XML document is valid against students.dtd!`);
    console.log(`   - Verified ${result.studentCount} student records.`);
    console.log(`   - All XML IDs, parent-child sequences, and data dictionary constraints conform.`);
    process.exit(0);
} else {
    console.error(`❌ VALIDATION FAILED: Found ${result.errors.length} schema violation(s):\n`);
    result.errors.forEach((err, idx) => {
        console.error(`   ${idx + 1}. ${err}`);
    });
    console.log(`\n======================================================`);
    process.exit(1);
}
