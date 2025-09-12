import { Button } from "../../components/ui/button";

const Login = () => {
    return <div className="flex flex-col items-center justify-center h-full w-full">
        <h1 className="text-2xl font-bold">BiteCount</h1>
        <div className="flex flex-col gap-4 items-center justify-center w-full">
            <Button variant="outline" className="w-full">Login with Google</Button>
            <Button variant="outline" className="w-full"    >Login with Apple</Button>
            <Button variant="default" className="w-full">Login with Email</Button>
        </div>
    </div>;
};

export default Login;