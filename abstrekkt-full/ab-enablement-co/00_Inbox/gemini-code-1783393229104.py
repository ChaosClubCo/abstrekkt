from weasyprint import HTML

html_content = """
<!DOCTYPE html>
<html>
<head>
<style>
    *, *::before, *::after { box-sizing: border-box; }
    @page {
        size: A4;
        margin: 15mm 12mm;
        background-color: #eef2f5;
    }
    body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: #2c3e50;
    }
    .header {
        background-color: #34495e;
        color: white;
        padding: 40px 12mm;
        margin: -15mm -12mm 20px -12mm;
    }
    h1 { margin: 0; font-size: 22pt; font-weight: 600; }
    h2 { font-size: 15pt; color: #2c3e50; border-left: 4px solid #3498db; padding-left: 12px; margin-top: 25px; page-break-after: avoid; }
    p { font-size: 11pt; line-height: 1.6; }
    .content-box {
        background: white;
        padding: 20px;
        border-radius: 6px;
        border: 1px solid #dcdde1;
        margin-bottom: 20px;
    }
</style>
</head>
<body>
    <div class="header">
        <h1>Document Template</h1>
    </div>
    <div class="content-box">
        <h2>Missing Specification</h2>
        <p>A file has been generated, but no specific content, topic, or file format was requested.</p>
    </div>
    <div class="content-box">
        <h2>Next Steps</h2>
        <p>Please provide the required details, such as the desired data, target audience, and preferred file type (e.g., PDF, XLSX, CSV), to generate the correct asset.</p>
    </div>
</body>
</html>
"""
with open('template.html', 'w') as f:
    f.write(html_content)

HTML(filename='template.html').write_pdf('template.pdf')
print("file-tag: template.pdf")