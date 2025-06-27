
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar } from "lucide-react";
import { useStaff } from "@/hooks/useStaff";

const StaffSection = () => {
  const { data: staff, isLoading } = useStaff();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">Loading our amazing staff...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!staff || staff.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">Meet our dedicated cinema staff who make your movie experience exceptional.</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Our team information will be available soon.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Our Team</h2>
          <p className="text-lg text-muted-foreground">
            Meet our dedicated cinema staff who make your movie experience exceptional.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {staff.filter(member => member.status === 'active').map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="text-sm">{member.position}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                {member.department && (
                  <Badge variant="secondary" className="text-xs">
                    {member.department}
                  </Badge>
                )}
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Since {new Date(member.hire_date).getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Want to join our team? Contact us for career opportunities!
          </p>
        </div>
      </div>
    </section>
  );
};

export default StaffSection;
