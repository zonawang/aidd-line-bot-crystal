# Cross-Unit Traceability

## Sources

- ../u1-zona-crystal-bot/code-generation/code-generation-plan.md
- ../u1-zona-crystal-bot/code-generation/unit-test-instructions.md
- ../u1-zona-crystal-bot/code-generation/code-summary.md
- 全部六份 nfr-requirements 與六份 nfr-design 產出；Testing Contract。

## Verdict

FAIL：原100詳細ID全部status=OK且target存在；但stage要求直接枚舉FR與母層NFR，而既有traceability只列AC／詳細NFR／BR。以下列出衍生功能對照，不改寫凍結檔或將其冒充直接OK。此為紀錄格式缺口，並非已證明原功能消失。映射存在也不代表NFR4.1人工通過或R-01修復。

## Per-ID Coverage

| ID | Verdict | Owning Stage / Unit | Target | Evidence |
|---|---|---|---|---|
| FR1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/http.test.js, test/u1-zona-crystal-bot/line.test.js | 衍生對照，不能代替直接entry |
| FR1.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/http.test.js, test/u1-zona-crystal-bot/line.test.js | 衍生對照，不能代替直接entry |
| FR1.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 衍生對照，不能代替直接entry |
| FR2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 衍生對照，不能代替直接entry |
| FR2.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 衍生對照，不能代替直接entry |
| FR2.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 衍生對照，不能代替直接entry |
| FR3 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/line.test.js, test/u1-zona-crystal-bot/memory.test.js | 衍生對照，不能代替直接entry |
| FR3.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/memory.test.js | 衍生對照，不能代替直接entry |
| FR3.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/line.test.js, test/u1-zona-crystal-bot/memory.test.js | 衍生對照，不能代替直接entry |
| FR4 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js, test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/knowledge.test.js, test/u1-zona-crystal-bot/line.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR4.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR4.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/knowledge.test.js, test/u1-zona-crystal-bot/line.test.js | 衍生對照，不能代替直接entry |
| FR5 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 衍生對照，不能代替直接entry |
| FR5.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 衍生對照，不能代替直接entry |
| FR6 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR6.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 衍生對照，不能代替直接entry |
| FR6.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR7 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR7.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR8 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 衍生對照，不能代替直接entry |
| FR8.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 衍生對照，不能代替直接entry |
| FR8.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 衍生對照，不能代替直接entry |
| FR9 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR9.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR10 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/http.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR10.1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/http.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| FR10.2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 衍生對照，不能代替直接entry |
| NFR1 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/http.test.js, test/u1-zona-crystal-bot/line.test.js, test/u1-zona-crystal-bot/memory.test.js, test/u1-zona-crystal-bot/schema.test.js | 衍生對照，不能代替直接entry |
| NFR2 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/line.test.js, test/u1-zona-crystal-bot/memory.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| NFR3 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 衍生對照，不能代替直接entry |
| NFR4 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js, test/u1-zona-crystal-bot/ui.test.js | 衍生對照，不能代替直接entry |
| NFR5 | FAIL：沒有直接OK entry | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js, test/u1-zona-crystal-bot/experience.test.js, test/u1-zona-crystal-bot/http.test.js, test/u1-zona-crystal-bot/memory.test.js | 衍生對照，不能代替直接entry |
| AC1.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC1.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC1.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/http.test.js | 直接映射 |
| AC1.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 直接映射 |
| AC1.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 直接映射 |
| AC1.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 直接映射 |
| AC2.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC2.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC2.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC2.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC2.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC2.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC3.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/memory.test.js | 直接映射 |
| AC3.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 直接映射 |
| AC3.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/memory.test.js | 直接映射 |
| AC3.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/memory.test.js | 直接映射 |
| AC3.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 直接映射 |
| AC3.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC4.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC4.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC4.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC4.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC4.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 直接映射 |
| AC4.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC5.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC5.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC5.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/consultation.test.js | 直接映射 |
| AC6.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC6.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC6.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/line.test.js | 直接映射 |
| AC6.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC6.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC6.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC7.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC7.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC7.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC8.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC8.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC8.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC8.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC8.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC8.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/knowledge.test.js | 直接映射 |
| AC9.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 直接映射 |
| AC9.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/experience.test.js | 直接映射 |
| AC9.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC10.1.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC10.1.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/ui.test.js | 直接映射 |
| AC10.1.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/http.test.js | 直接映射 |
| AC10.2.1 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 直接映射 |
| AC10.2.2 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 直接映射 |
| AC10.2.3 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 直接映射 |
| AC10.2.4 | PASS | code-generation / U1 | test/u1-zona-crystal-bot/delivery.test.js | 直接映射 |

## Uncovered Elements

FR1, FR1.1, FR1.2, FR2, FR2.1, FR2.2, FR3, FR3.1, FR3.2, FR4, FR4.1, FR4.2, FR5, FR5.1, FR6, FR6.1, FR6.2, FR7, FR7.1, FR8, FR8.1, FR8.2, FR9, FR9.1, FR10, FR10.1, FR10.2, NFR1, NFR2, NFR3, NFR4, NFR5
