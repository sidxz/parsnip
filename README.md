# PARSNIP

To view the latest release, please visit  
**https://parsnip-56158.web.app**

## Protein Assessment and Ranking System for Novel Input
Designed to support the early stages of anti-TB research, PARSNIP is an open-source tool that ranks potential drug targets using a multi-dimensional scoring system. It evaluates proteins based on their biological importance, safety profile, and "druggability," providing a clear, visual way to compare different targets. As a public companion to the internal DAIKON system, it empowers the global research community to make evidence-based decisions and refine target priorities in real-time, offering a template that can be used for various bacterial threats.

## Part of the DAIKON Ecosystem
PARSNIP serves as the public-facing companion to DAIKON (Data Acquisition, Integration, and Knowledge Capture), an open-source framework developed to manage the early drug discovery pipeline, from target identification through portfolio management. DAIKON is currently implemented in the TB Drug Accelerator (TBDA) program, a partnership of pharmaceutical companies, academic institutions, and research groups supported by the Gates Foundation.
Within DAIKON, the target prioritization module functions as an abstract layer that accepts quantitative or qualitative scoring inputs and promotes high-priority proteins from the gene pool into the active target pipeline. PARSNIP implements and exposes this module publicly, enabling the broader research community to apply the same evidence-based prioritization logic used internally by TBDA collaborators, without requiring access to the full DAIKON platform.

For more on the DAIKON framework, see publication (https://pubs.acs.org/doi/10.1021/acsptsci.3c00034) Rath S, Panda S, Sacchettini JC, Berthel SJ. DAIKON: A Data Acquisition, Integration, and Knowledge Capture Web Application for Target-Based Drug Discovery. ACS Pharmacol Transl Sci. 2023 Jun 22 PMID: 37470023; PMCID: PMC10353056

A full user manual for DAIKON, including detailed documentation on the Targets module, is available at: [https://saclab.github.io/daikon/docs/user-guide/Targets/parsnip](https://saclab.github.io/daikon/docs/user-guide/Targets/parsnip)

The DAIKON codebase is available on GitHub:

Frontend: https://github.com/sidxz/Daikon2-FE
All repositories: https://github.com/sidxz
