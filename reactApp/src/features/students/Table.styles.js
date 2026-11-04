import styled from 'styled-components';

export const TableWrapper = styled.div`
    margin: 2rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    border: 1px solid #e1e5e9;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: var(--table-height, calc(100vh - 200px)); /* Customizable height with fallback */

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #f1f3f4;
        flex-shrink: 0; /* Don't shrink the header */

        h2 {
            margin: 0;
            color: #2c3e50;
            font-weight: 600;
            font-size: 1.75rem;
            letter-spacing: -0.025em;
        }

        button {
            background: #3498db;
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);

            &:hover {
                background: #2980b9;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
            }

            &:active {
                transform: translateY(0);
            }
        }
    }

    .table-controls {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        
        @media (max-width: 768px) {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
        }
    }

    .table-responsive {
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        background: white;
        flex: 1; /* Take remaining space */
        overflow: auto; /* Scroll in both directions instead of clipping columns */
        margin-bottom: 1rem; /* Reduced margin since we have flex layout */

        .table-controls {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 1rem;
            background: #f8f9fa;
            border-bottom: 1px solid #e1e5e9;

            /* Column headers (and their sort) are hidden in the mobile card layout */
            .mobile-sort-btn {
                display: none;
                min-width: 0;
                padding: 8px 14px;
                font-size: 12px;
                background: #ffffff;
                color: #495057;
                border: 1px solid #ced4da;
            }

            .height-control {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #495057;
                    margin: 0;
                }

                select {
                    padding: 8px 12px;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    font-size: 14px;
                    background: #ffffff;
                    color: #495057;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    &:focus {
                        outline: none;
                        border-color: #3498db;
                        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
                    }

                    &:hover {
                        border-color: #adb5bd;
                    }
                }
            }
        }

        table {
            margin-bottom: 0;
            width: 100%;

            thead {
                background: #fafbfc;
                z-index: 10;

                th {
                    border: none;
                    padding: 14px 20px;
                    font-weight: 600;
                    text-align: left;
                    color: #6c757d;
                    user-select: none;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid #e9ecef;

                    &.sortable {
                        cursor: pointer;
                        transition: color 0.2s ease;

                        &:hover {
                            color: #212529;
                        }
                    }

                    &.actions-header {
                        text-align: right;
                    }
                }
            }

            tbody {
                tr {
                    border-bottom: 1px solid #eef0f2;
                    transition: background 0.15s ease;

                    &:last-child {
                        border-bottom: none;
                    }

                    &:hover {
                        background: #f8fafc;
                    }

                    td {
                        padding: 12px 20px;
                        text-align: left;
                        vertical-align: middle;
                        border: none;
                        color: #333;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 1.5;

                        &:first-child {
                            font-weight: 500;
                            color: #2c3e50;
                        }

                        &:nth-child(2) {
                            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                            color: #6c757d;
                        }
                    }
                }
            }
        }
    }

    .btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        border: 2px solid;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: relative;
        overflow: hidden;
        min-width: 120px;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        &:hover:before {
            left: 100%;
        }

        &.btn-outline-secondary {
            background: transparent;
            color: #6c757d;
            border-color: #6c757d;

            &:hover {
                background: #6c757d;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
            }
        }

        &.btn-outline-danger {
            background: transparent;
            color: #dc3545;
            border-color: #dc3545;

            &:hover {
                background: #dc3545;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
            }
        }

        &.btn-primary {
            background: #3498db;
            border-color: #3498db;
            color: #ffffff;

            &:hover {
                background: #2980b9;
                border-color: #2980b9;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
            }
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
    }

    /* Row actions: small, neutral buttons; colour only shows on hover, red is kept for Delete */
    .action-cell {
        width: 1%;
        white-space: nowrap;
    }

    .row-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;

        &.grades-actions {
            justify-content: flex-start;
        }

        .btn {
            min-width: 0;
            padding: 5px 12px;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            background: #ffffff;
            color: #495057;
            font-size: 13px;
            font-weight: 500;
            text-transform: none;
            letter-spacing: 0;
            transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

            &:before {
                display: none;
            }

            &:hover {
                transform: none;
                box-shadow: none;
                background: #f1f5f9;
                border-color: #cbd5e1;
                color: #212529;
            }

            &.btn-outline-primary:hover {
                color: #2980b9;
                border-color: #a9cce3;
                background: #eef6fc;
            }

            &.btn-outline-danger {
                color: #c0392b;

                &:hover {
                    color: #a93226;
                    border-color: #f1b0a9;
                    background: #fdf1f0;
                }
            }
        }
    }

    .no-grades {
        color: #adb5bd;
        font-size: 13px;
    }

    /* Loading state */
    .loading-row {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    /* Empty state */
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: #6c757d;

        .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        .empty-text {
            font-size: 1.1rem;
            font-weight: 500;
        }
    }

    /* Responsive design */
    @media (max-width: 1024px) {
        margin: 1.5rem;
        padding: 1.5rem;
        height: var(--table-height, calc(100vh - 150px));

        .table-header {
            h2 {
                font-size: 1.5rem;
            }
        }

        .table-responsive {
            .table-controls {
                padding: 0.75rem;
                
                .height-control {
                    label {
                        font-size: 13px;
                    }
                    
                    select {
                        padding: 6px 10px;
                        font-size: 13px;
                    }
                }
            }
            
            table {
                thead th, tbody td {
                    padding: 12px 16px;
                    font-size: 13px;
                }
            }
        }
    }

    @media (max-width: 768px) {
        margin: 1rem;
        padding: 1rem;
        /* Let the page scroll naturally instead of a fixed-height inner scroll area */
        height: auto;

        .table-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;

            h2 {
                font-size: 1.3rem;
            }

            button {
                width: 100%;
                max-width: 200px;
            }
        }

        .table-responsive {
            .table-controls {
                padding: 0.5rem;
                justify-content: center;
                
                .height-control {
                    label {
                        font-size: 12px;
                    }
                    
                    select {
                        padding: 5px 8px;
                        font-size: 12px;
                    }
                }
            }
            
            font-size: 12px;
            border-radius: 8px;

            table {
                thead th, tbody td {
                    padding: 10px 12px;
                    font-size: 12px;
                }

                thead th {
                    font-size: 11px;
                    letter-spacing: 0.3px;
                }
            }
        }

        .btn {
            padding: 10px 20px;
            font-size: 12px;
            min-width: 100px;
        }

        /* Card layout: each row becomes a stacked card with inline labels */
        .table-responsive {
            overflow: visible;
            border: none;
            box-shadow: none;
            background: transparent;
            flex: none;

            .table-controls {
                flex-direction: row;
                justify-content: space-between;
                border: 1px solid #e1e5e9;
                border-radius: 8px;
                margin-bottom: 0.75rem;

                .mobile-sort-btn {
                    display: inline-block;
                }

                .height-control {
                    display: none;
                }
            }

            table,
            table tbody {
                display: block;
                width: 100%;
            }

            table thead {
                display: none;
            }

            table tbody tr,
            table tbody tr:nth-child(even) {
                display: flex;
                flex-wrap: wrap;
                gap: 0 0.5rem;
                background: #ffffff;
                border: 1px solid #e1e5e9;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                margin-bottom: 0.75rem;
                padding: 0.5rem 0.75rem;
            }

            table tbody tr td {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
                width: 100%;
                padding: 6px 0;
                font-size: 14px;
                text-align: right;
                word-break: break-word;

                &::before {
                    content: attr(data-label);
                    flex-shrink: 0;
                    text-align: left;
                    font-family: inherit;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #6c757d;
                }

                .grades-cell {
                    max-width: none !important;
                    white-space: normal !important;
                }

                &.action-cell {
                    width: 100%;
                    padding-top: 0.5rem;
                    border-top: 1px solid #f1f3f4;

                    &::before {
                        display: none;
                    }

                    .row-actions {
                        width: 100%;

                        .btn {
                            flex: 1;
                            padding: 8px 4px;
                        }
                    }
                }

                &.empty-state {
                    display: block;
                    text-align: center;

                    &::before {
                        display: none;
                    }
                }
            }
        }
    }

    @media (max-width: 480px) {
        margin: 0.5rem;
        padding: 0.75rem;
        border-radius: 8px;

        .table-header {
            h2 {
                font-size: 1.2rem;
            }
        }

        .table-responsive {
            .table-controls {
                padding: 0.5rem;
                
                .height-control {
                    flex-direction: column;
                    gap: 0.25rem;
                    
                    label {
                        font-size: 11px;
                    }
                    
                    select {
                        padding: 4px 6px;
                        font-size: 11px;
                    }
                }
            }
            
            table {
                thead th, tbody td {
                    padding: 8px 10px;
                    font-size: 11px;
                }
            }
        }
    }

    /* Pagination container styles */
    .pagination-container {
        flex-shrink: 0; /* Don't shrink pagination */
        margin-top: auto; /* Push to bottom */
        padding-top: 1rem;
        border-top: 1px solid #e1e5e9;
    }
`;

export const TableActionWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
`;