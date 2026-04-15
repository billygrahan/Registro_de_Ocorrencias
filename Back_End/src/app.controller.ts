import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller()
export class AppController {
    @Get()
    getHello(@Res() res: Response): void {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Registro de Ocorrências - API</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    
                    .container {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        padding: 50px;
                        text-align: center;
                        max-width: 500px;
                        width: 100%;
                    }
                    
                    h1 {
                        color: #333;
                        margin-bottom: 10px;
                        font-size: 32px;
                    }
                    
                    .subtitle {
                        color: #666;
                        margin-bottom: 30px;
                        font-size: 16px;
                    }
                    
                    .status {
                        display: inline-block;
                        background: #10b981;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 50px;
                        margin-bottom: 30px;
                        font-weight: 600;
                    }
                    
                    .button-group {
                        display: flex;
                        gap: 12px;
                        margin-bottom: 30px;
                        flex-direction: column;
                    }
                    
                    .btn {
                        padding: 14px 24px;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-decoration: none;
                        display: inline-block;
                    }
                    
                    .btn-primary {
                        background: #667eea;
                        color: white;
                    }
                    
                    .btn-primary:hover {
                        background: #5568d3;
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                    }
                    
                    .btn-secondary {
                        background: #f3f4f6;
                        color: #333;
                    }
                    
                    .btn-secondary:hover {
                        background: #e5e7eb;
                        transform: translateY(-2px);
                    }
                    
                    .info-box {
                        background: #f0f9ff;
                        border-left: 4px solid #667eea;
                        padding: 16px;
                        text-align: left;
                        border-radius: 6px;
                        margin-bottom: 20px;
                    }
                    
                    .info-box h3 {
                        color: #667eea;
                        font-size: 14px;
                        margin-bottom: 8px;
                    }
                    
                    .info-box p {
                        color: #666;
                        font-size: 14px;
                        margin: 6px 0;
                    }
                    
                    .features {
                        text-align: left;
                        margin-top: 30px;
                        padding-top: 30px;
                        border-top: 1px solid #e5e7eb;
                    }
                    
                    .features h3 {
                        color: #333;
                        margin-bottom: 16px;
                    }
                    
                    .feature-item {
                        display: flex;
                        align-items: center;
                        margin: 12px 0;
                        color: #666;
                    }
                    
                    .feature-item:before {
                        content: "✓";
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        background: #10b981;
                        color: white;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 24px;
                        margin-right: 12px;
                        font-weight: bold;
                        flex-shrink: 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Registro de Ocorrências</h1>
                    <p class="subtitle">API GraphQL para Gerenciamento de Incidentes</p>
                    
                    <div class="status">✓ Servidor Online</div>
                    
                    <div class="button-group">
                        <a href="/graphql" class="btn btn-primary">→ Abrir Apollo Sandbox</a>
                    </div>
                    
                    <div class="info-box">
                        <h3>📡 Apollo Sandbox</h3>
                        <p>IDE completo para testar e documentar sua API GraphQL</p>
                        <p>• Auto-complete inteligente</p>
                        <p>• Documentação automática do schema</p>
                        <p>• Histórico de queries</p>
                    </div>
                    
                    <div class="features">
                        <h3>🎯 Recursos Disponíveis</h3>
                        <div class="feature-item">Queries (5) para buscar incidentes</div>
                        <div class="feature-item">Mutations (4) para criar/editar/deletar</div>
                        <div class="feature-item">MongoDB Atlas para persistência</div>
                        <div class="feature-item">TypeScript com type-safety</div>
                        <div class="feature-item">Hot-reload em desenvolvimento</div>
                    </div>
                </div>
            </body>
            </html>
        `)
    }
}
