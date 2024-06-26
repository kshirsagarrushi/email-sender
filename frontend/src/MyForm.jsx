import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function MyForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [emails, setEmails] = useState([]); 
  const baseUrl = "https://email-sender-backend-chi.vercel.app/";

  const handleUpload = (event) => {
    if (!file) {
      toast.info("Please select a file");
      return;
    }
    toast.success("Files is being parsed");

    // Read the file and extract emails
    readAndExtractEmails(file);
  };

  const readAndExtractEmails = (uploadedFile) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Assuming 'A' column contains emails. You can adjust it based on your sheet structure.
        const column = "A";
        const emailColumn = Object.keys(sheet).filter((key) =>
          key.startsWith(column)
        );
        const extractedEmails = emailColumn.map((key) => sheet[key].v);
        console.log("Extracted Emails:", extractedEmails);

        // Update state to append emails to the existing ones
        setEmails((prevEmails) => [...prevEmails, ...extractedEmails]);
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error reading file. Please try again.");
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };
  const sendEmail = async () => {
    toast.success("Email is being sent...");
  
    // Define the email message template
    const emailTemplate = `Hi XXXXX,
  
  Congratulations!! Your entry to Wolf Den is Confirmed. #entertheden
  
  Thank you for booking your pass for Wolf Den Investors Summit 2024 - Mumbai happening on 5th and 6th April 2024. 
  
  Venue Details:
  
  NESCO Center, Western Express Highway, Goregaon (East), Mumbai 400063
  
  [View directions from your location to NESCO in Google Maps.](https://maps.google.com)
  
  **Important - Please make a note of below:**
  
  1) Please find attached your entry pass that you will need to display at the registration desk.
  
  2) [CLICK HERE](#) and mark yourself as attending so that we can make the required arrangements for you.
  
  3) To be eligible for a surprise gift worth INR 1 lakh, click on the link below.
  
  [LinkedIn Link](#) to be added
  
  "I am attending #WolfDen and look forward to meeting like-minded entrepreneurs and investors.
  
  #Entertheden #venturewolf #startupfunding #startupnetworking
  With - @Venture Wolf @Devang Raja
  
  Hope you will make the best use of the event in growing your connections, business, and raising funds. 
  
  We look forward to hosting you at the event.
  
  Thanks & Regards,
  
  Wolf Den Team.
  
  [Website](https://www.venturewolf.in)
  
  Stay in touch with us at: [LinkedIn](https://www.linkedin.com/company/venturewolf/)`;
  
    // Send email with the predefined template
    let dataSend = {
      email: email,
      subject: subject,
      message: emailTemplate,
      emails: emails
    };
  
    try {
      const res = await fetch(`${baseUrl}/email/sendEmail`, {
        method: "POST",
        body: JSON.stringify(dataSend),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      console.log("The status of res is ", res.status);
  
      if (res.status > 199 && res.status < 300) {
        // Email sent successfully
        toast.success("Email is sent");
        alert("Sent Successfully !");
      } else {
        // Handle other status codes if needed
        console.error("Failed to send email. Status code:", res.status);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  
  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <ToastContainer />
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Send email to the account</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              
              <FormControl id="email">
                <FormLabel>Subject</FormLabel>
                <Input
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  placeholder="Enter the subject here..."
                />
              </FormControl>
              {/* <FormControl id="text">
                <FormLabel>Message</FormLabel>
                <Textarea
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                />
              </FormControl> */}
              <FormControl id="file">
                <FormLabel>Choose Excel File</FormLabel>
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
                {JSON.stringify(emails)}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() => handleUpload()}
                >
                 Upload
                </Button>
              </Stack>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() => sendEmail()}
                >
                  Send Email
                </Button>
              </Stack>
              
              
            </Stack>
          </Box>
         
        </Stack>
        
      </Flex>
      
    </>
  );
}
