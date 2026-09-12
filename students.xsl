<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <title>Student Academic Registry - XSLT Engine</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #f8fafc; margin: 0; }
                    .report-card { max-width: 900px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                    h2 { color: #1e293b; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                    th { background-color: #0f172a; color: #ffffff; font-weight: 600; }
                    tr:nth-child(even) { background-color: #f1f5f9; }
                    .pass { color: #166534; font-weight: bold; }
                    .fail { color: #991b1b; font-weight: bold; background-color: #fee2e2; }
                    .badge-status { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
                    .status-distinction { background-color: #dbeafe; color: #1e40af; }
                    .status-passed { background-color: #dcfce7; color: #166534; }
                    .status-remedial { background-color: #fee2e2; color: #991b1b; }
                </style>
            </head>
            <body>
                <div class="report-card">
                    <h2>Academic Roster (Direct XML/XSLT Rendering)</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Semester</th>
                                <th>Marks</th>
                                <th>Academic Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="students/student">
                                <tr>
                                    <td><strong><xsl:value-of select="@id"/></strong></td>
                                    <td><xsl:value-of select="name"/></td>
                                    <td><xsl:value-of select="email"/></td>
                                    <td><xsl:value-of select="department"/></td>
                                    <td>Semester <xsl:value-of select="semester"/></td>
                                    <td>
                                        <xsl:attribute name="class">
                                            <xsl:choose>
                                                <xsl:when test="marks &lt; 40">fail</xsl:when>
                                                <xsl:otherwise>pass</xsl:otherwise>
                                            </xsl:choose>
                                        </xsl:attribute>
                                        <xsl:value-of select="marks"/>%
                                    </td>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when test="marks &gt;= 75">
                                                <span class="badge-status status-distinction">Distinction</span>
                                            </xsl:when>
                                            <xsl:when test="marks &gt;= 40">
                                                <span class="badge-status status-passed">Passed</span>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <span class="badge-status status-remedial">Remedial Required</span>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
