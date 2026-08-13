const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Recipe Management API",
            version: "1.0.0",
            description:
                "REST API for managing recipes, ingredients, cooking steps and recipe images"
        },

        servers: [
            {
                url:
                    process.env.API_URL ||
                    "http://localhost:5000/api",
                description: "Recipe API"
            }
        ],

        tags: [
            {
                name: "Recipes",
                description: "Recipe management APIs"
            },
            {
                name: "Authentication",
                description: "Authentication APIs"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },

            schemas: {
                Recipe: {
                    type: "object",

                    properties: {
                        _id: {
                            type: "string",
                            example: "64f123456789abcdef123456"
                        },

                        title: {
                            type: "string",
                            example: "Chicken Biryani"
                        },

                        description: {
                            type: "string",
                            example: "Aromatic Indian chicken biryani"
                        },

                        preparationTime: {
                            type: "integer",
                            example: 20
                        },

                        cookingTime: {
                            type: "integer",
                            example: 45
                        },

                        servingSize: {
                            type: "integer",
                            example: 4
                        },

                        cuisine: {
                            type: "string",
                            example: "Indian"
                        },

                        foodType: {
                            type: "string",
                            enum: [
                                "Vegetarian",
                                "Non-Vegetarian",
                                "Vegan",
                                "Egg"
                            ],
                            example: "Non-Vegetarian"
                        },

                        difficulty: {
                            type: "string",
                            enum: [
                                "Easy",
                                "Medium",
                                "Hard"
                            ],
                            example: "Medium"
                        },

                        rating: {
                            type: "object",

                            properties: {
                                average: {
                                    type: "number",
                                    example: 4.5
                                },

                                count: {
                                    type: "integer",
                                    example: 120
                                }
                            }
                        },

                        images: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    filename: {
                                        type: "string",
                                        example: "recipe-123456.jpg"
                                    },

                                    url: {
                                        type: "string",
                                        example: "/uploads/recipes/recipe-123456.jpg"
                                    },

                                    mimetype: {
                                        type: "string",
                                        example: "image/jpeg"
                                    },

                                    size: {
                                        type: "integer",
                                        example: 245678
                                    },

                                    order: {
                                        type: "integer",
                                        example: 1
                                    }
                                }
                            }
                        },

                        ingredients: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    name: {
                                        type: "string",
                                        example: "Chicken"
                                    },

                                    quantity: {
                                        type: "string",
                                        example: "500"
                                    },

                                    unit: {
                                        type: "string",
                                        example: "g"
                                    },

                                    order: {
                                        type: "integer",
                                        example: 1
                                    }
                                }
                            }
                        },

                        steps: {
                            type: "array",

                            items: {
                                type: "object",

                                properties: {
                                    description: {
                                        type: "string",
                                        example: "Marinate the chicken."
                                    },

                                    order: {
                                        type: "integer",
                                        example: 1
                                    }
                                }
                            }
                        },

                        createdBy: {
                            type: "string",
                            example: "64f123456789abcdef123456"
                        },

                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },

                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },

                User: {
                    type: "object",

                    properties: {
                        id: {
                            type: "string"
                        },

                        name: {
                            type: "string",
                            example: "John Doe"
                        },

                        email: {
                            type: "string",
                            example: "john@example.com"
                        },

                        role: {
                            type: "string",
                            enum: [
                                "user",
                                "admin"
                            ],
                            example: "user"
                        }
                    }
                },

                Error: {
                    type: "object",

                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },

                        message: {
                            type: "string",
                            example: "Recipe not found"
                        }
                    }
                }
            }
        }
    },

    apis: [
        path.resolve(
            __dirname,
            "../routes/recipe.routes.js"
        ),
        path.resolve(
            __dirname,
            "../routes/auth.routes.js"
        )
    ]
};

const swaggerSpec = swaggerJsdoc(options);

console.log(
    "Swagger paths:",
    Object.keys(swaggerSpec.paths || {})
);

module.exports = swaggerSpec;