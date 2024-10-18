import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    tags: [
      {
        name: "Products",
        description: "API operations related to products",
      },
    ],
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description: "API Docs for Products",
    },
  },
  apis: ["./src/router.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUIOptions: SwaggerUiOptions = {
  customCss: `
        .topbar-wrapper .link {
            content: url('https://th.bing.com/th/id/OIP.pCgQMQFJSf6wlp2FMKQjmgHaEc?rs=1&pid=ImgDetMain');
            height: 120px;
            width: auto;
        };
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript'
};

export default swaggerSpec;
export {
    swaggerUIOptions
};
