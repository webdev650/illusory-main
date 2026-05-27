import React from 'react';

const RefundPolicy = () => {
  return (
    <section className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Refund & Cancellation Policy</h1>
        <p className="text-lg text-gray-600">Effective Date: 01.06.2025</p>
      </header>

      <div className="prose">
        <p className="mb-6">
          By engaging our services, the Client acknowledges and agrees to this Refund & Cancellation Policy, 
          unless otherwise stated in a written and signed agreement.
        </p>

        <div className="mb-8">
          <p className="mb-4">
            At Illusory Design Studios Pvt. Ltd., we take pride in delivering customized creative solutions 
            tailored specifically to our clients needs. Due to the personalized nature of our services, refunds 
            are handled with careful consideration of the time, effort, and resources invested.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Advance Payment and Non-Refundable Component</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upon confirmation of the project, a 50% advance payment is required to initiate work.</li>
              <li>30% of the total project fee is strictly non-refundable, as it covers resource allocation, planning, concept development, and initial creative direction.</li>
              <li>The remaining 20% of the advance may be eligible for refund only under specific circumstances (see Section 2).</li>
              <li>Refund eligibility is also subject to Section 7 (Agreement Precedence).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Refund Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A partial refund of the refundable portion of the advance may be considered only if:</li>
              <ul className="list-[circle] pl-6 space-y-2 mt-2">
                <li>The Company is unable to start or deliver services due to unforeseen internal issues.</li>
                <li>The project is cancelled before any substantial work has commenced (e.g., no concepts, drafts, or meetings delivered).</li>
              </ul>
              <li>Refund requests will be reviewed and approved solely at the discretion of the Company&apos;s Directors.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. No Refund Scenarios</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No refund (partial or full) will be issued if:</li>
              <ul className="list-[circle] pl-6 space-y-2 mt-2">
                <li>Work has already begun, including concept design, drafts, meetings, or client reviews.</li>
                <li>The delay or dissatisfaction arises due to client-side factors, such as delayed approvals, incomplete information, or mid-project scope changes.</li>
                <li>The Client chooses to cancel the project after deliverables have been initiated or submitted.</li>
                <li>The project was terminated due to a breach of terms (non-cooperation, non-payment, misuse of content).</li>
              </ul>
              <li>The Company reserves the right to determine whether a refund is applicable, based on internal review, even if the Client disagrees with the outcome.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Customization Clause</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Since each project is tailored uniquely to the Client&apos;s goals and vision:</li>
              <ul className="list-[circle] pl-6 space-y-2 mt-2">
                <li>All services, once rendered or partially delivered, are considered consumed and non-refundable.</li>
                <li>Refunds cannot be claimed on the basis of subjective preferences or dissatisfaction with creative direction after agreed-upon deliverables are shared.</li>
              </ul>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Process for Requesting a Refund</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All refund requests must be submitted in writing via email to: business@illusorydesignstudios.com.</li>
              <li>Requests should clearly state the reason, project reference, and any relevant supporting details.</li>
              <li>The Company will respond within 7 business days with an approval, denial, or request for clarification.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Refund Mode and Timelines</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Approved refunds will be processed via bank transfer or the original payment method within 15 business days of approval.</li>
              <li>No interest or compensation is applicable on the refund amount.</li>
              <li>Refunds will only be made to the original Client and not to any third-party vendors or representatives.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Agreement Precedence</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>In cases where a signed contract, agreement, or proposal exists between Illusory Design Studios Pvt. Ltd. and the Client:</li>
              <ul className="list-[circle] pl-6 space-y-2 mt-2">
                <li>The terms of that document shall override this general Refund & Cancellation Policy.</li>
                <li>Any refund-related clauses within the contract take precedence in the event of conflict or inconsistency.</li>
              </ul>
            </ul>
            <div className="mt-4 p-4 bg-gray-50 rounded-3xl text-black">
              <p className="font-medium">Optional Clause for Contracts (Signature Section)</p>
              <p>&quot;Both parties agree that in case of disputes, the terms defined in this contract will supersede any general refund policy publicly available or otherwise.&quot;</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default RefundPolicy;