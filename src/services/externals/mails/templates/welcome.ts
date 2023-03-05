export const HTML_TEMPLATE = (
  title: string,
  name: string,
  address: string
): string => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
          * {
              box-sizing: border-box;
              padding: 0;
              margin: 0;
              font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
          }
          body {
              height: 100vh;
              display: flex;
              justify-content: center;
          }
            .sub-container {
              height: 40%;
              padding: 12px;
              margin-top: 90px;
              border-radius: 10px;
              border: 1px solid #858282; 
            }
            .header {
              padding-bottom: 8px;
              border-bottom: 1px solid #858282;
            }
            h1 {
              text-align: center;
              font-size: 20px;
              padding: 8px 0;
            }
            h1 span:first-child {
              color: rgb(61, 180, 228);
              font-family: Arial, Helvetica, sans-serif;
            }
            h1 span:last-child {
              color: rgb(156, 82, 226);
              font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            }
            h2 {
              padding: 12px;
              text-align: center;
            }
            .content {
              padding: 0 30px;
              height: 70%;
              line-height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 0.9rem;
              text-align: center;
            }
            p a {
              display: inline-block;
              text-decoration: underline;
              color: rgb(156, 82, 226);
              cursor: pointer;
            }
            footer {
              font-size: 12px;
              padding: 4px 0;
              text-align: center;
              color: gray;
            }
      </style>
  </head>
  <body>
      <div class="container">
        <div class="sub-container">
          <div class="header">
            <h1><span>D</span><span>T</span></h1>
            <h2><span>${name}</span> Welcome to this application</h2>
          </div>
          <div class="content">
            <p>Your account has been created successfully. Please start to enjoy and if any difficulty, report please to this mail address <a href='mailto:${address}'>${address}</a>.</p>
          </div>
         </div>
         <footer>
          You received this email to let you know about important changes to your DT Account and services.
          © 2023 DT LLC, 1600, CAMEROUN, DOUALA.
         </footer>
        </div>
  </body>
  </html>`;
};
