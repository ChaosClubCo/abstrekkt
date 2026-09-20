> Source: https://community.n8n.io/t/supabase-metadata/115261

n8n CommunitySupabase metadata
Questions  n8n-nodeDilbert May 14, 2025, 12:18pm  1  
I’m trying to pass metadata to the supabase vector store node to save with the embeddings. this includes location data and client number.
The table is set up with a location column and it is ready for geographical information. Each time i pass the data the meta data is added as a row in the table and not to the column location, does anyone have any pointers to how I can correctly set this up?
1 Like  amirfahd May 14, 2025, 12:42pm  2  
Do you have RLS enabled? Maybe this is a policy issue. If you’re seeing location data getting passed but not being stored correctly you can check on your RLS policy.
Another thing could be a mismatch of data type.
Dilbert May 14, 2025, 1:09pm  3  
No RLS is disabled until i can figure out how to get the metadata written, the mismatch of data type is a possibility for the locaiton although the client_id i’m also trying to pass is just a text field.
amirfahd May 14, 2025, 2:52pm  4  
Okay, there could be an issue in parsing
Possible json format being passed
{ "metadata": { "location": "POINT(125.607 7.072)", "client_id": "abc123" } } 
You need to flatten your metadata
{ "location": { "type": "Point", "coordinates": [125.607, 7.072] }, "client_id": "abc123" } 
Or if you are using SQL or a prepared payload in n8n
{ "location": "POINT(125.607 7.072)", // as string, if your column is text "client_id": "abc123" } amirfahd May 14, 2025, 2:54pm  5  
You can check this, this might help you @Dilbert
Multiple entries in supabase vector store metadata filterQuestions Hello everyone, I’m currently working on a RAG cha where users can access a set of meetings, and I need to filter the available meetings based on the meeting_ids that the user has access to. Here’s the scenario: i have a vector store with the my metadata looking like this: { meeting_id: "id1", other_fields: "blah"} Each user has a list of meeting_ids that define which meetings they have access to. These meeting_ids are hard-coded as of now, just to test. When filtering the meetings that a u… Dilbert May 15, 2025, 7:18pm  6    amirfahd:    "location": { "type": "Point", "coordinates": [125.607, 7.072] }, "client_id": "abc123" } 
Thanks for your help amirfahd. The metadata is going into the database just not in the right columns
Screenshot 2025-05-15 at 20.14.13 1840×160 29.5 KB
The code I’m using before the supabase vector store node is return 
  [ 
  { 
  json: { 
  embedding: [0.12, 0.88, 0.45], 
  consultant_id: “abc-123”, 
  location: { 
  type: “Point”, 
  coordinates: [-0.1278, 51.5074] 
  }, 
  } 
  } 
  ];
Any Ideas?
amirfahd May 16, 2025, 8:33am  7  
Okay this is good. You just need to add a Code node before saving to the Supabase vector to flatten the json being passed.
The thing is your input:
{ json: { embedding: [0.12, 0.88, 0.45], consultant_id: “abc-123”, location: { type: “Point”, coordinates: [-0.1278, 51.5074] }, } } 
We should flatten it to exactly match the Supabase columns which it doesn’t at the moment.
Add this code inside the  Code Node  and let me know how it goes.
return $input.all().map(item => { const { text, embedding, consultant_id, location, metadata } = item.json; const [lon, lat] = location.coordinates; return { json: { content: text, embedding: embedding, consultant_id: consultant_id, location: `POINT(${lon} ${lat})`, metadata: metadata || {} } }; }); 
Your json should look like this after passing the Code node.
{ "content": "This is a sample document", "embedding": [0.12, 0.88, 0.45], "consultant_id": "abc-123", "location": "POINT(-0.1278 51.5074)", "metadata": { "source": "scraped", "priority": "high" } } 
Have a great day!
Dilbert May 19, 2025, 9:47am  8    amirfahd:   { "content": "This is a sample document", "embedding": [0.12, 0.88, 0.45], "consultant_id": "abc-123", "location": "POINT(-0.1278 51.5074)", "metadata": { "source": "scraped", "priority": "high" } } 
Amirfahd,
I think it is the supabase vector store node that is causing me the issue, if I use the supabase node i get the correct data written to the columns, if I use the vector store node I do not, it just goes as another row.
I need to be able to store the id and the location on each row of the embeddings, any further ideas?
Thanks
Andy
1 Like  amirfahd May 19, 2025, 3:54pm  9  
Hi @Dilbert,
What you can do is just do as is,
Use the Supabase Vector Store to insert  embedding ,  content , and maybe  metadata
Then add a  Supabase Update node  using the returned  id
Set  location  and  consultant_id  correctly in that row
Let me know if that solved your issue.
King_Samuel_David May 19, 2025, 5:30pm  10  
nice ideas, need to use superbase more   thanks for this info
1 Like  system Closed   August 17, 2025, 5:30pm  11  
This topic was automatically closed 90 days after the last reply. New replies are no longer allowed.
Powered by Discourse, best viewed with JavaScript enabled