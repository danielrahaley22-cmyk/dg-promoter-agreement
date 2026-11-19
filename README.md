# dg-promoter-agreement

DG XXL January 2027 promoter agreement form.

- `index.html` – the form promoters fill in (served by GitHub Pages).
- `apps-script/Code.gs` – Google Apps Script attached to the "DG Promoter Agreements" sheet. It adds each submission as a row and emails a copy.

To connect: deploy the script as a web app (Execute as: Me, Access: Anyone) and paste its `/exec` URL into `SCRIPT_URL` in `index.html`.
