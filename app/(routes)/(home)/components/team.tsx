import TeamMembers from "@/components/team-members";
import TitleBox from "@/components/ui/title-box";

const OurTeam = () => {
  return (
    <section className="py-16">
      <div className="container">
        <TitleBox title="Our Team" />
        <TeamMembers />
      </div>
    </section>
  );
};

export default OurTeam;
