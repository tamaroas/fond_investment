import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
interface Props {
    title: string
    description: string,
    children: React.ReactNode,
    content_footer: React.ReactNode,

}

export default function LayoutCard(props: Props) {
    const { content_footer, children, description, title } = props

    return (
        <Card className="max-w-sm min-w-80">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter className="flex justify-between">
                {content_footer}
                {/* <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button> */}
            </CardFooter>
        </Card>
    )

}