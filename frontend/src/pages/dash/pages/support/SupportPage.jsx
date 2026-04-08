import { PageWrapper, FormField, SaveBtn, inputCls } from "../../components/DashComponents.jsx";

export function Support() {
  return (
    <PageWrapper title="Support" subtitle="Raise a ticket or contact us">
      <div className="max-w-lg flex flex-col gap-5">
        <FormField label="Subject">
          <input type="text" placeholder="Brief subject of your issue" className={inputCls} />
        </FormField>
        <FormField label="Category">
          <select className={inputCls}>
            <option>Payment Issue</option>
            <option>Account Problem</option>
            <option>Team Query</option>
            <option>Technical Issue</option>
            <option>Other</option>
          </select>
        </FormField>
        <FormField label="Message">
          <textarea rows={5} placeholder="Describe your issue in detail..." className={`${inputCls} resize-y`} />
        </FormField>
        <SaveBtn label="Submit Ticket" />
      </div>
    </PageWrapper>
  );
}