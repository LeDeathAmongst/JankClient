class dirrect extends guild{
    constructor(JSON,owner){
        super(-1);
        console.log(JSON);
        this.owner=owner;
        if(!this.owner){
            console.error("Owner was not included, please fix")
        }
        this.channels=[];
        this.channelids={};
        this.id="@me";
        this.properties={};
        this.roles=[];
        this.roleids={};
        this.prevchannel=undefined;
        this.properties.name="Dirrect Messages";
        for(const thing of JSON){
            const temp=new group(thing,this);
            this.channels.push(temp);
            this.channelids[temp.id]=temp;
        }
        this.headchannels=this.channels;
    }
    createChannelpac(JSON){
        const thischannel=new group(JSON,owner);
        this.channelids[JSON.id]=thischannel;
        this.channels.push(thischannel);
        this.calculateReorder();
        this.printServers();
    }
    sortchannels(){
        this.headchannels.sort((a,b)=>{
            const result=(BigInt(a.lastmessageid)-BigInt(b.lastmessageid));
            return Number(-result);
        });
    }
    giveMember(member){
        console.error("not a real guild, can't give member object")
    }
    getRole(ID){
        return null;
    }
    hasRole(r){
        return false;
    }
    isAdmin(){
        return false;
    }
    unreaddms(){
        for(const thing of this.channels){
            thing.unreads();
        }
    }
}
class group extends channel{
    constructor(JSON,owner){
        super(-1);
        this.owner=owner;
        this.messages=[];
        console.log(JSON.recipients,JSON)
        this.name=JSON.recipients[0]?.username;
        if(JSON.recipients[0]){
            this.user=new user(JSON.recipients[0]);
        }else{
            this.user=this.owner.owner.user;
        }
        this.name??=owner.owner.user.username;
        this.id=JSON.id;
        this.parent_id=null;
        this.parrent=null;
        this.children=[];
        this.guild_id="@me";
        this.messageids={};
        this.permission_overwrites=[];
        this.lastmessageid=JSON.last_message_id;
        this.lastmessageid??=0;
        this.mentions=0;
    }
    createguildHTML(){
        const div=document.createElement("div")
        div.classList.add("channeleffects");
        const myhtml=document.createElement("span");
        myhtml.innerText=this.name;
        div.appendChild(this.user.buildpfp());
        div.appendChild(myhtml);
        div.myinfo=this;
        div.onclick=function(){
            this.myinfo.getHTML();
        }
        return div;
    }
    getHTML(){
        this.owner.prevchannel=this;
        this.owner.owner.channelfocus=this.id;
        this.putmessages();
        history.pushState(null, null,"/channels/"+this.guild_id+"/"+this.id);
        document.getElementById("channelname").innerText="@"+this.name;
    }
    messageCreate(messagep,focus){
        const messagez=new cmessage(messagep.d);
        this.lastmessageid=messagez.id;
        if(messagez.author===this.owner.owner.user){
            this.lastreadmessageid=messagez.id;
        }
        this.messages.unshift(messagez);
        const scrolly=document.getElementById("messagecontainer");
        this.messageids[messagez.id]=messagez;
        if(this.owner.owner.lookingguild.prevchannel===this){
            var shouldScroll=scrolly.scrollTop+scrolly.clientHeight>scrolly.scrollHeight-20;
            messages.appendChild(messagez.buildhtml(this.messages[1]));
        }
        if(shouldScroll){
                scrolly.scrollTop = scrolly.scrollHeight;
        }
        console.log(document.getElementById("channels").children)
        if(this.owner.owner.lookingguild===this.owner){
            const channellist=document.getElementById("channels").children[0]
            for(const thing of channellist.children){
                if(thing.myinfo===this){
                    channellist.prepend(thing);
                    console.log(thing.myinfo);
                    break;
                }
                console.log(thing.myinfo,this,thing.myinfo===this);
            }
        }
        this.unreads();
    }
    unreads(){
        const sentdms=document.getElementById("sentdms");
        let current=null;
        for(const thing of sentdms.children){
            console.log(thing.all)
            if(thing.all===this){
                current=thing;
            }
        }
        console.log(current,this.hasunreads);
        if(this.hasunreads){
            if(current){current.noti.innerText=this.mentions;return;}
            const div=document.createElement("div");
            div.classList.add("servernoti");
            const noti=document.createElement("div");
            noti.classList.add("unread","notiunread","pinged");
            noti.innerText=this.mentions;
            console.log(this.mentions)
            div.noti=noti;
            div.append(noti)
            const buildpfp=this.user.buildpfp();
            div.all=this;
            buildpfp.classList.add("mentioned");
            console.log(this);
            div.append(buildpfp)
            sentdms.append(div);
            div.onclick=function(){
                this.all.owner.loadGuild();
                this.all.getHTML();
            }
        }else if(current){
            console.log("remove")
            current.remove();
        }else{
            console.log(sentdms.children)
        }
    }
}
