<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>

    <xsl:template match="/">
        <html lang="en">
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Academic Grade Report &amp; Transcripts | Presentation Pipeline</title>
            <style>
                :root {
                    --primary: #4f46e5;
                    --primary-dark: #3730a3;
                    --success: #10b981;
                    --warning: #f59e0b;
                    --danger: #ef4444;
                    --bg-page: #f8fafc;
                    --card-bg: #ffffff;
                    --text-main: #1e293b;
                    --text-muted: #64748b;
                    --border: #e2e8f0;
                }
                body {
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    background-color: var(--bg-page);
                    color: var(--text-main);
                    margin: 0;
                    padding: 30px 20px;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .report-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 24px;
                    background: linear-gradient(135deg, #0f172a, #1e293b);
                    color: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                }
                .report-header h1 {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    letter-spacing: 0.5px;
                }
                .report-header p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 14px;
                }
                .student-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .grade-card {
                    background: var(--card-bg);
                    border-radius: 14px;
                    border: 1px solid var(--border);
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .grade-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 20px -8px rgba(0,0,0,0.12);
                }
                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 12px;
                    margin-bottom: 14px;
                }
                .student-id {
                    font-weight: 700;
                    font-size: 15px;
                    background: #e0e7ff;
                    color: #3730a3;
                    padding: 4px 10px;
                    border-radius: 6px;
                }
                .dept-tag {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 3px 8px;
                    border-radius: 20px;
                    text-transform: uppercase;
                }
                .dept-CE, [class*="dept-Computer"] { background: #dbeafe; color: #1e40af; }
                .dept-IT, [class*="dept-Information"] { background: #dcfce7; color: #166534; }
                .dept-EXTC, [class*="dept-Electronics"] { background: #fef3c7; color: #92400e; }

                .student-name {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 6px 0;
                    color: #1e293b;
                }
                .student-email {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin-bottom: 16px;
                    word-break: break-all;
                }
                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    background: #f8fafc;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                }
                .detail-label {
                    font-size: 11px;
                    text-transform: uppercase;
                    color: #64748b;
                    font-weight: 600;
                }
                .detail-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                }
                .score-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 10px;
                    border-top: 1px dashed var(--border);
                }
                .score-pill {
                    font-size: 20px;
                    font-weight: 800;
                }
                .grade-badge {
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 13px;
                }
                .grade-O { background: #10b981; color: white; }
                .grade-A { background: #3b82f6; color: white; }
                .grade-B { background: #f59e0b; color: white; }
                .grade-C { background: #6366f1; color: white; }
                .grade-F { background: #ef4444; color: white; }
                
                @media print {
                    body { background: white; padding: 0; }
                    .grade-card { break-inside: avoid; border: 1px solid #ccc; box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header class="report-header">
                    <h1>Academic Grade Card &amp; Performance Records</h1>
                    <p>Generated via Data Presentation Pipeline (students.xml + students.xsl)</p>
                </header>

                <div class="student-grid">
                    <xsl:for-each select="students/student">
                        <xsl:sort select="marks" data-type="number" order="descending"/>
                        <div class="grade-card">
                            <div>
                                <div class="card-top">
                                    <span class="student-id"><xsl:value-of select="@id"/></span>
                                    <span class="dept-tag dept-{department}"><xsl:value-of select="department"/></span>
                                </div>
                                <h2 class="student-name"><xsl:value-of select="name"/></h2>
                                <div class="student-email"><xsl:value-of select="email"/></div>

                                <div class="details-grid">
                                    <div>
                                        <div class="detail-label">Semester</div>
                                        <div class="detail-value">Term <xsl:value-of select="semester"/></div>
                                    </div>
                                    <div>
                                        <div class="detail-label">Status</div>
                                        <div class="detail-value">
                                            <xsl:choose>
                                                <xsl:when test="marks &gt;= 40">PASS</xsl:when>
                                                <xsl:otherwise>ARREAR</xsl:otherwise>
                                            </xsl:choose>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="score-section">
                                <div>
                                    <span class="score-pill"><xsl:value-of select="marks"/>%</span>
                                </div>
                                <div>
                                    <xsl:choose>
                                        <xsl:when test="marks &gt;= 90">
                                            <span class="grade-badge grade-O">Grade: O (Outstanding)</span>
                                        </xsl:when>
                                        <xsl:when test="marks &gt;= 75">
                                            <span class="grade-badge grade-A">Grade: A (Distinction)</span>
                                        </xsl:when>
                                        <xsl:when test="marks &gt;= 60">
                                            <span class="grade-badge grade-B">Grade: B (First Class)</span>
                                        </xsl:when>
                                        <xsl:when test="marks &gt;= 40">
                                            <span class="grade-badge grade-C">Grade: C (Pass)</span>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <span class="grade-badge grade-F">Grade: F (Fail)</span>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </div>
                            </div>
                        </div>
                    </xsl:for-each>
                </div>
            </div>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
